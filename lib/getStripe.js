import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
    if (!stripePromise) {
        const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
        if (!stripePublicKey) {
            throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is missing in environment variables.");
        }
        stripePromise = loadStripe(stripePublicKey);
    }
    return stripePromise;
};

export default getStripe;
