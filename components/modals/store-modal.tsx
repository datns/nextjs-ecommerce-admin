"use client"
import * as z from 'zod';
import {useForm} from "react-hook-form";

import {Modal} from "@/components/ui/modal";
import {useStoreModal} from "@/hooks/use-store-modal";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import axios from "axios";
import {toast} from "react-hot-toast";

const formSchema = z.object({
	name: z.string().min(1),
})
export const StoreModal = () => {
	const {isOpen, onOpen, onClose} = useStoreModal();
	const [loading, setLoading] = useState<boolean>(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		}
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setLoading(true);
			const response = await axios.post('/api/stores', values)
			window.location.assign(`/${response.data.id}`);
			// toast.success("Store created.")
		} catch (e) {
			console.log(e)
			toast.error("Something went wrong.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title="Create store"
			description="Add a new store to manage products and categories"
			isOpen={isOpen}
			onClose={onClose}>
				<div>
					<div className="space-y-4 py-2 pb-4">
						<Form
							{...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<FormField
									control={form.control}
									render={({field}) => (
										<FormItem>
											<FormLabel>
												Name
											</FormLabel>
											<FormControl>
												<Input  placeholder="E-Commerce" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
									name="name" />
								<div className="pt-6 space-x-2 flex items-center justify-end w-full">
									<Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
									<Button type="submit">Continue</Button>
								</div>
							</form>
						</Form>
					</div>
				</div>

		</Modal>
	)
}
