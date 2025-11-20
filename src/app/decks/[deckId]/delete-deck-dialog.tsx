'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteDeckAction } from './actions';

interface DeleteDeckDialogProps {
	deckId: number;
	deckName: string;
	cardCount: number;
}

export function DeleteDeckDialog({
	deckId,
	deckName,
	cardCount,
}: DeleteDeckDialogProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleDelete = async () => {
		setError(null);
		setIsDeleting(true);

		try {
			const result = await deleteDeckAction(deckId);

			if (result.success) {
				// Close dialog and redirect to dashboard
				setOpen(false);
				router.push('/dashboard');
			} else {
				setError(result.error);
			}
		} catch (err) {
			setError('An unexpected error occurred');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant='destructive' size='sm'>
					Delete Deck
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the deck{' '}
						<span className='font-semibold text-foreground'>"{deckName}"</span>{' '}
						and all {cardCount} {cardCount === 1 ? 'card' : 'cards'} associated
						with it.
					</AlertDialogDescription>
				</AlertDialogHeader>
				{error && (
					<div className='text-sm text-destructive font-medium'>{error}</div>
				)}
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={e => {
							e.preventDefault();
							handleDelete();
						}}
						disabled={isDeleting}
						className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
					>
						{isDeleting ? 'Deleting...' : 'Delete Deck'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

