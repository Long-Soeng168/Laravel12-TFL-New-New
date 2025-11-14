import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Loader2Icon } from 'lucide-react';

interface ProfileForm {
    name: string;
    email: string;
    phone: string;
    gender: string;
    image: any;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        phone: auth.user.phone || '',
        gender: auth.user.gender || '',
        image: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Profile settings'),
            href: '/settings/profile',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* <AppHeader /> */}
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title={t('Profile information')} description={t('Update your name and email address')} />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t('Name')}</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder={t('Name')}
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">{t('Email')}</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder={t('Email')}
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">{t('Phone Number')}</Label>

                            <Input
                                id="phone"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                autoComplete="phone"
                                placeholder={t('Phone Number')}
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gender">{t('Gender')}</Label>

                            <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                <SelectTrigger id="gender" className="w-full">
                                    <SelectValue placeholder={t('Select')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">{t('Male')}</SelectItem>
                                    <SelectItem value="female">{t('Female')}</SelectItem>
                                    <SelectItem value="other">{t('Other')}</SelectItem>
                                </SelectContent>
                            </Select>

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="image">{t('Image')}</Label>

                            <Input
                                id="image"
                                type="file"
                                className="mt-1 block w-full"
                                onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>
                                {processing && (
                                    <span className="animate-spin">
                                        <Loader2Icon />
                                    </span>
                                )}
                                {t('Submit')}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600">{t('Saved')}</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
