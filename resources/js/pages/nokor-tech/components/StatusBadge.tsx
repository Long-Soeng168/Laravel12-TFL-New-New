import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, PackageCheck, RefreshCcw, ShieldCheck, Truck, XCircle } from 'lucide-react';
import { JSX } from 'react';

const statusColors: Record<string, string> = {
    // 🔹 Payment statuses
    APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'PRE-AUTH': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
    PENDING: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    DECLINED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    REFUNDED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',

    // 🔹 Order statuses
    completed: 'bg-green-500 text-white dark:bg-green-700 dark:text-white',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    refunded: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const statusIcons: Record<string, JSX.Element> = {
    // 🔹 Payment statuses
    APPROVED: <CheckCircle className="mr-1 size-4" />,
    'PRE-AUTH': <ShieldCheck className="mr-1 size-4" />,
    PENDING: <Clock className="mr-1 size-4" />,
    DECLINED: <XCircle className="mr-1 size-4" />,
    REFUNDED: <RefreshCcw className="mr-1 size-4" />,
    CANCELLED: <XCircle className="mr-1 size-4" />,

    // 🔹 Order statuses
    pending: <Clock className="mr-1 size-4" />,
    paid: <CheckCircle className="mr-1 size-4" />,
    shipped: <Truck className="mr-1 size-4" />,
    completed: <PackageCheck className="mr-1 size-4" />,
    cancelled: <XCircle className="mr-1 size-4" />,
    refunded: <RefreshCcw className="mr-1 size-4" />,
};

const StatusBadge = ({ status }: { status: string }) => {
    return (
        <Badge className={statusColors[status] || 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}>
            {statusIcons[status]}
            {status}
        </Badge>
    );
};

export default StatusBadge;
