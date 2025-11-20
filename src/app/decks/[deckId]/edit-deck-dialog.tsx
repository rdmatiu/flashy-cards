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
import { updateDeckAction } from './actions';

interface EditDeckDialogProps {
	deckId: number;
	currentName: string;
	currentDescription?: string;
}

export function EditDeckDialog({
	deckId,
	currentName,
	currentDescription,
}: EditDeckDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(currentName);
	const [description, setDescription] = useState(currentDescription || '');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Reset form when dialog opens
	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (newOpen) {
			setName(currentName);
			setDescription(currentDescription || '');
			setError('');
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			const result = await updateDeckAction(deckId, {
				name,
				description: description || undefined,
			});

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

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant='outline'>Edit Deck</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[525px]'>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Edit Deck</DialogTitle>
						<DialogDescription>
							Update the name and description of your deck.
						</DialogDescription>
					</DialogHeader>

					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='name'>Name</Label>
							<Input
								id='name'
								placeholder='Deck name...'
								value={name}
								onChange={e => setName(e.target.value)}
								required
							/>
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='description'>Description (optional)</Label>
							<Textarea
								id='description'
								placeholder='What is this deck about?'
								value={description}
								onChange={e => setDescription(e.target.value)}
								rows={3}
							/>
						</div>

						{error && (
							<div className='text-sm text-red-500 font-medium'>{error}</div>
						)}
					</div>

					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type='submit' disabled={isSubmitting}>
							{isSubmitting ? 'Saving...' : 'Save Changes'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

