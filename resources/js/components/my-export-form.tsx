import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useTranslation from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { DownloadCloud } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    fields: z.array(z.string()).nonempty('Please at least one item'),
    status: z.string(),
    name_8309640405: z.string(),
});

export default function MyExportForm() {
    const { t } = useTranslation();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fields: ['All Fields'],
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                </pre>,
            );
        } catch (error) {
            console.error('Form submission error', error);
            toast.error('Failed to submit the form. Please try again.');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-6">
                <FormField
                    control={form.control}
                    name="fields"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Fields</FormLabel>
                            <FormControl>
                                <MultiSelector values={field.value} onValuesChange={field.onChange} loop className="max-w-full">
                                    <MultiSelectorTrigger className="border">
                                        <MultiSelectorInput placeholder="Select languages" />
                                    </MultiSelectorTrigger>
                                    <MultiSelectorContent>
                                        <MultiSelectorList>
                                            <MultiSelectorItem value={'Title'}>Title</MultiSelectorItem>
                                            <MultiSelectorItem value={'Title Khmer'}>Title Khmer</MultiSelectorItem>
                                            <MultiSelectorItem value={'Created At'}>Created At</MultiSelectorItem>
                                            <MultiSelectorItem value={'Updated At'}>Updated At</MultiSelectorItem>
                                            <MultiSelectorItem value={'...'}>...</MultiSelectorItem>
                                            <MultiSelectorItem value={'....'}>....</MultiSelectorItem>
                                        </MultiSelectorList>
                                    </MultiSelectorContent>
                                </MultiSelector>
                            </FormControl>
                            <FormDescription>Select multiple options.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem key={field.value}>
                            <FormLabel>{t('Status')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>Select Status that you want to export</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name_8309640405"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
                                    {[
                                        ['Male', 'male'],
                                        ['Female', 'female'],
                                        ['Other', 'other'],
                                    ].map((option, index) => (
                                        <FormItem className="flex items-center space-y-0 space-x-3" key={index}>
                                            <FormControl>
                                                <RadioGroupItem value={option[1]} />
                                            </FormControl>
                                            <FormLabel className="font-normal">{option[0]}</FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormDescription>Select your gender</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="duration-200rounded-md hover:text-primary-foreground border border-black bg-white px-4 py-2 text-sm text-black transition hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                >
                    <DownloadCloud />
                    Dowload
                </Button>
            </form>
        </Form>
    );
}
