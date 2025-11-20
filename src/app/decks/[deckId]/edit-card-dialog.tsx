'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateCardAction, deleteCardAction } from './actions';

interface EditCardDialogProps {
	deckId: number;
	card: {
		id: number;
		front: string;
		back: string;
	};
}

export function EditCardDialog({ deckId, card }: EditCardDialogProps) {
	const [open, setOpen] = useState(false);
	const [front, setFront] = useState(card.front);
	const [back, setBack] = useState(card.back);
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			const result = await updateCardAction(card.id, deckId, { front, back });

			if (result.success) {
				setOpen(false);
			} else {
				setError(result.error);
			}
		} catch (err) {
			setError('An unexpected error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this card?')) {
			return;
		}

		setError('');
		setIsDeleting(true);

		try {
			const result = await deleteCardAction(card.id, deckId);

			if (result.success) {
				setOpen(false);
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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm'>
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[525px]'>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Edit Card</DialogTitle>
						<DialogDescription>
							Update the content of this flashcard.
						</DialogDescription>
					</DialogHeader>

					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='front'>Front</Label>
							<Textarea
								id='front'
								placeholder='Question or term...'
								value={front}
								onChange={e => setFront(e.target.value)}
								rows={3}
								required
							/>
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='back'>Back</Label>
							<Textarea
								id='back'
								placeholder='Answer or definition...'
								value={back}
								onChange={e => setBack(e.target.value)}
								rows={3}
								required
							/>
						</div>

						{error && (
							<div className='text-sm text-red-500 font-medium'>{error}</div>
						)}
					</div>

					<DialogFooter className='flex justify-between sm:justify-between'>
						<Button
							type='button'
							variant='destructive'
							onClick={handleDelete}
							disabled={isSubmitting || isDeleting}
						>
							{isDeleting ? 'Deleting...' : 'Delete Card'}
						</Button>
						<div className='flex gap-2'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setOpen(false)}
								disabled={isSubmitting || isDeleting}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting || isDeleting}>
								{isSubmitting ? 'Saving...' : 'Save Changes'}
							</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
