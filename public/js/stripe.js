import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
    'pk_test_51LrJebSHp048486X1gHcoXZykyZOuGcHxL584MnC06hS7feWPMmcu9fk0e745tlBIrDeOOHeYuIZkWMUVjldpY0r00G1gljyBZ'
);

export const bookTour = async (tourId) => {
    try {
        // Get the session from server
        const session = await axios(
            `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
        );
        console.log(session);

        // Create checkout + charge the credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        showAlert('error', err);
    }
};
