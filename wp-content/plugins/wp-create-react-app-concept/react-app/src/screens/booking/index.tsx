import React from 'react'
import moment from 'moment'
import { Spinner, Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { cancelActiveBookingApi, getActiveBookingApi, getAvailableBookingTimeApi, submitBookingApi } from 'store/webServiceApi/booking'
import { ActiveBooking, BookAvailableTime } from 'type/booking'
import Calendar from 'react-calendar';

//styles
import './styles.scss'
import 'react-calendar/dist/Calendar.css';
import { useUser } from 'store/userStore'
import { Link, useHistory } from 'react-router-dom'
import {getErrorMessage, REQUEST_BRANCH} from 'lib/handy'
import { useMarketContext } from 'store/marketStore'

//assets

type TimeInterval = BookAvailableTime & {
    isSelected: boolean,
    drawHour: boolean,
    hour: String | undefined
}

let numberOfGuests : string[] = [];

const Booking = () => {

    //hooks
    const { user } = useUser();
    const { storeInfo } = useMarketContext();
    const history = useHistory();


    //states
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [activeBooking, setActiveBooking] = React.useState<ActiveBooking | null>();
    const [targetTime, setTargetTime] = React.useState<moment.Moment>(moment().add(1, 'day'))
    const [timeIntervals, setTimeIntervals] = React.useState<TimeInterval[] | null>();
    const [selectedCapacity, setSelectedCapacity] = React.useState<number>(2);
    const [selectedDate, setSelectedDate] = React.useState<Date>(targetTime.toDate());
    const [isPresentDatePicker, setIsPresentDatePicker] = React.useState<boolean>(false);
    const [isSelectedCapacityInvalid, setIsSelectedCapacityInvalid] = React.useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [hasSelect, setHasSelect] = React.useState<boolean>(false);
    const [isCancelConfirmModalPresented, setIsCancelConfirmModalPresented] = React.useState<boolean>(false)

    //references
    const targetTimeRef = React.useRef<moment.Moment>(targetTime);
    const selectedCapacityRef = React.useRef<number>(selectedCapacity);

    React.useEffect(() => {
        selectedCapacityRef.current = selectedCapacity
    }, [selectedCapacity]);

    React.useEffect(() => {
        getActiveBookingApi()
            .then((activeBooking) => {
                if(!!activeBooking) { setActiveBooking(activeBooking) }
                else { setActiveBooking(null) }
            })
    }, []);

    React.useEffect(() => {
        if (storeInfo != undefined && storeInfo.is_booking_active == false) {
            toast.error('Booking service is not active in this restaurant!')
            history.replace('/')
        }
        else {

            let limit;
            numberOfGuests = [];

            if(storeInfo != null)
                limit = storeInfo.maximum_acceptance_capacity;
            else
                limit = 15;

            for(let i = 1; i <= limit; i++)
                numberOfGuests.push(i + "");
        }
    }, [storeInfo]);

    React.useEffect(() => {
        //if user is not authenticated just return
        if (user == undefined) return;
        targetTimeRef.current = targetTime;
        getAvailableTimes()
    }, [targetTime, user]);

    const getAvailableTimes = (signal?: AbortSignal) => {
        setTimeIntervals(undefined);
        getAvailableBookingTimeApi({ date: targetTimeRef.current, signal })
            .then((e) => {

                let uniqueHours : Map<String, boolean> = new Map<String, boolean>();
                let out : TimeInterval[] = [];

                e.map(i => {

                    let drawHour: boolean = false;
                    let h : String = "";

                    if(i.is_available) {
                        h = i.time.toString().substr(0, i.time.toString().indexOf(":"));
                        if (uniqueHours.has(h))
                            drawHour = false;
                        else {
                            drawHour = true;
                            uniqueHours.set(h, true);
                        }
                    }

                    out.push({...i, isSelected: false, drawHour: drawHour, hour: h + ":00"})
                });

                return out;
            })
            .then(setTimeIntervals)
            .catch((e) => {
                toast.error(getErrorMessage(e));
                setTimeIntervals(null)
            })
    };

    const toggleSelectedIndex = (index: number) => {
        setHasSelect(true);
        setTimeIntervals(p => !!p ? p.map((e, i) => ({ ...e, isSelected: i == index ? true : false  })) : undefined)
    };

    const openCalendar = () => {
        setIsPresentDatePicker(true)
    };

    const setReferSession = () => {
        window.localStorage.refer = "/menu/booking";
    };

    const guestQuantityChanged = (newValue: string) => {
        setIsLoading(true);
        let numberValue = parseInt(newValue);
        if (`${numberValue}` != newValue) {  setIsSelectedCapacityInvalid(true); return }
        else { setIsSelectedCapacityInvalid(false) }
        setSelectedCapacity(numberValue != NaN ? numberValue : 1);
        setTimeout(function () {
            setIsLoading(false);
        }, 1500);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (user == undefined) return

        let selectedInterval = timeIntervals?.filter(e => e.isSelected == true)
        if (selectedInterval == undefined || selectedInterval.length == 0) {
            toast.error('Please select one of the times for booking')
            return
        }
        let branchId = REQUEST_BRANCH()
        if (branchId == undefined) return

        setIsSubmitting(true)

        toast.promise(
            submitBookingApi({
                customer_id: user.id,
                start: `${targetTimeRef.current.format('YYYY-MM-DD')}T${selectedInterval[0].time}`,
                branch_id: branchId,
                number_of_guests: selectedCapacityRef.current,
            }).then(setActiveBooking)
            .finally(() => {
                setActiveBooking({
                    "id": "",
                    "start": new Date(),
                    "end": new Date(),
                    "number_of_guests": selectedCapacityRef.current,
                    "duration": 1,
                    "description": "",
                    "status": "success",
                    "customer_id": user.id,
                    "customer_name": user.username,
                    "branch_id": "",
                    "branch_name": "",
                    "invitations": []
                });
                setIsSubmitting(false);
            }),
            {
              loading: 'Loading',
              success: () => `Successfully booked`,
              error: (e) => getErrorMessage(e),
        })
    }

    const cancelActiveBooking = (id: string) => {
        setIsSubmitting(true)

        toast.promise(
            cancelActiveBookingApi(id)
            .then(() => {
                setIsCancelConfirmModalPresented(false);
                setActiveBooking(null)
            })
            .finally(() => setIsSubmitting(false)),
            {
              loading: 'Loading',
              success: () => `Successfully canceled your booking`,
              error: (e) => getErrorMessage(e),
        })
    }

    return <Container>
        <Row>
            <Col>
                <Form.Group />
                { user && activeBooking == null && <Card>
                    <Card.Title className='centered headerFont'>Booking</Card.Title>
                    <Card body>
                        <Row>
                            <Col md="6">
                                <Form onSubmit = { handleSubmit  } validated = { true }>
                                    <Form.Group >
                                        <h1 className='centered textFont2'>
                                            Book a table
                                        </h1>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Booking date <span className="required">*</span></Form.Label>
                                        <div className='bookDateBox' onClick = { openCalendar }>
                                            <span>{ targetTime.format('dddd DD-MM-YYYY') }</span>
                                        </div>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Number of guests <span className="required">*</span></Form.Label>

                                        <Form.Control
                                            required
                                            defaultValue = { selectedCapacity }
                                            type="text"
                                            as="select"
                                            onChange = { e => guestQuantityChanged(e.target.value) }
                                        >
                                            {
                                                numberOfGuests.map(option => (
                                                <option key={option}> {option}</option>
                                            ))}
                                        </Form.Control>

                                        <Form.Control.Feedback type='invalid'>
                                            Please enter a valid number
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Button disabled = { !hasSelect || isSubmitting || isSelectedCapacityInvalid || user == undefined } variant="primary" type="submit">
                                            Continue
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>

                            <Col md="6" className='availableTimesWrapperParent'>
                                <div className='availableTimesWrapper'>
                                    { (isLoading || timeIntervals == undefined) && <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner> }
                                    { !isLoading && timeIntervals?.length == 0 && <p>There is no available times for book in this day!</p> }
                                    {
                                        !isLoading && timeIntervals && timeIntervals
                                            .map((e, i) => {
                                                return !e.is_available ? '' :
                                                    e.drawHour ?
                                                        <div className={"a"}>
                                                            <h1 className={"labelHourInBooking"}>{e.hour}</h1>
                                                            <div onClick={() => toggleSelectedIndex(i)} key={i} className={`availableTimeItem ${ e.isSelected ? 'selected' : '' }`}>
                                                                <label>{e.time}</label>
                                                                <p className={e.capacity >= selectedCapacity ? 'availableLabel' : 'notAvailableLabel'}>{e.capacity >= selectedCapacity ? 'Available' : 'Not Available'}</p>
                                                            </div>
                                                        </div>
                                                    :
                                                    <div onClick={() => toggleSelectedIndex(i)} key={i}
                                                         className={`availableTimeItem ${ e.isSelected ? 'selected' : '' }`}>
                                                        <label>{e.time}</label>
                                                        <p className={e.capacity >= selectedCapacity ? 'availableLabel' : 'notAvailableLabel'}>{e.capacity >= selectedCapacity ? 'Available' : 'Not Available'}</p>
                                                    </div>
                                            })
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Card>
                }
                {
                    user == undefined && <Card>
                        <Card body>
                            <Form.Group className='centered'>
                                <Form.Label>In order to use booking service you need to login</Form.Label>
                            </Form.Group>
                            <Form.Group className='centered'>
                                <Link onClick={setReferSession} to ='/login'>Login</Link>
                            </Form.Group>
                        </Card>
                    </Card>
                }
                {
                    user && !!activeBooking && <Card>
                        <Card body>
                            <Form>
                                <Form.Group>
                                    <Form.Label className='centered'>Your active Booking</Form.Label>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        You have an active booking in this restaurant.
                                        Only one active booking is allowed for each restaurant
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        booking date
                                    </Form.Label>
                                    <Form.Control
                                        type='text'
                                        value = { moment(activeBooking.start).format('DD/MM/YYYY') }
                                        readOnly
                                        />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        Booking time
                                    </Form.Label>
                                    <Form.Control
                                        type='text'
                                        value = { moment(activeBooking.start).format('HH:mm') }
                                        readOnly
                                        />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        Number of guests
                                    </Form.Label>
                                    <Form.Control
                                        type='text'
                                        value = { activeBooking.number_of_guests }
                                        readOnly
                                        />
                                </Form.Group>

                                <Form.Group className="centered">
                                    <Button className="btn btn-danger" onClick = { () => setIsCancelConfirmModalPresented(true) }>Cancel this Booking</Button>
                                </Form.Group>
                            </Form>
                        </Card>
                    </Card>
                }
            </Col>
        </Row>
        <Modal scrollable animation={ false } show = { isPresentDatePicker } onHide={() => {
                setSelectedDate(targetTime.toDate())
                setIsPresentDatePicker(false)
            }}>
            <Modal.Header closeButton>
                <Modal.Title>Select a date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    { isPresentDatePicker && <div className='flexCentered'>
                        <Calendar
                            minDate = { new Date() }
                            onChange = { e => {
                                setSelectedDate(e);
                                setTargetTime(moment(e));
                                setIsPresentDatePicker(false)
                            }}
                            value = { selectedDate }
                        />
                    </div>}
                </Form.Group>
            </Modal.Body>
        </Modal>
        <Modal animation={ false } show = { isCancelConfirmModalPresented } onHide={() => setIsCancelConfirmModalPresented(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to remove this booking?
            </Modal.Body>
            <Modal.Footer className={"centeredFlex"}>
                <Button variant="secondary" onClick={() => setIsCancelConfirmModalPresented(false) }>
                    No
                </Button>
                <Button disabled = { isSubmitting } variant="primary" onClick = { () => activeBooking?.id && cancelActiveBooking(activeBooking.id) }>
                    Yes, I'm sure
                </Button>
            </Modal.Footer>
        </Modal>
    </Container>
}

export default Booking;
