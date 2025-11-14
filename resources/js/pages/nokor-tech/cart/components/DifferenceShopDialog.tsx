import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { CartSheet } from './CartSheet';

export function DifferenceShopDialog({ openDialog = false, setOpenDialog }) {
    const [openCartDialog, setOpeCartDialog] = useState(false);
    return (
        <>
            <CartSheet openCartDialog={openCartDialog} setOpeCartDialog={setOpeCartDialog} />
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="text-center sm:max-w-[400px]">
                    <DialogHeader>
                        <div className="mb-3 flex justify-center">
                            <AlertTriangle className="h-10 w-10 text-yellow-500" />
                        </div>
                        <DialogTitle className="text-center text-lg font-semibold">One Shop per Order</DialogTitle>
                        <DialogDescription className="text-center">
                            You can only buy products from one shop at a time. Please complete or clear your current cart before adding products from
                            another shop.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex justify-center gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                        <Button
                            onClick={() => {
                                setOpeCartDialog(true);
                                setOpenDialog(false);
                            }}
                        >
                            View Cart
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
