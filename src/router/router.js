import { createBrowserRouter } from 'react-router';
import Index from '@/pages/index';
import Home from '@/pages/home';
import Verify from '@/pages/verify';
import NotFound from '@/pages/not-found';

export const PATHS = {
    INDEX: '/',
    HOME: '/home',
    VERIFY: '/verify',
    TIMEACTIVE: '/timeactive'
};

const router = createBrowserRouter([
    
    {
        path: PATHS.HOME,
        element: <Home />
    },
    {
        path: PATHS.VERIFY,
        element: <Verify />
    },
    {
        path: `${PATHS.INDEX}/*`,
        element: <Index />
    },
    {
        path: '*',
        element: <Index />
    }
]);

export default router;
