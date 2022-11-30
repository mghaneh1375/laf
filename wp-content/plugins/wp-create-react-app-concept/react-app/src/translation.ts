import i18n from 'i18next';
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            'Day': 'Day',
            'AvailableTime': 'Avaible Time',
            'Name': 'Name',
            'Address': 'Address',
            'MenuTitle': 'Menu of Restaurant',
            'EatInTitle': 'Eat In Menu',
            'TakeOutTitle': 'Take Out Menu',
            'Menu': 'Menu',
            'Delivery': 'Delivery',
            'TakeOut': 'Take Out',
            'Booking': 'Booking',
            'ResturantInfo': 'Restaurant Information',
            'NotProperResponse': 'There is problem in server connection',
            'FiltersTitle': 'Select the type of your order',
            'ItemDetails': 'Details',
            'Close': 'Close',
            'AddToBasket': 'Add To Basket',
            'EditBasketItem': 'Update Basket',
            'ResturantTitle': 'Sample Restaurant Title',
            'SelectSize': 'Size: (choose one)',
            'MoreOrderDescription': 'Please write down, more details if you need, e.g. no salt.',
            'PleaseEnterPhone': 'please re-enter your phone!'
        }
    }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;
