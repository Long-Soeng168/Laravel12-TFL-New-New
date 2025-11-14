import AppLayout from '@/layouts/app-layout';
import { MyFileManagerDialog } from './my-file-manager-dialog';

export default function Page() {
    return (
        <AppLayout>
            <div className="flex h-svh items-center justify-center">
                <MyFileManagerDialog />
            </div>
        </AppLayout>
    );
}
