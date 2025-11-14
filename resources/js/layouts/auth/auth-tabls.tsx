import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';

const AuthTabs = () => {
    const { url } = usePage();

    const isLogin = url === '/login';
    const isRegister = url === '/register';

    const { t } = useTranslation();

    return (
        <div className="mx-auto mb-6 w-full max-w-full">
            <div className="bg-muted grid w-full grid-cols-2 overflow-hidden rounded-2xl border p-1">
                <Link
                    href="/login"
                    className={cn(
                        'rounded-xl py-2 text-center text-sm font-medium transition-all',
                        isLogin ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {t("Login")}
                </Link>
                <Link
                    href="/register"
                    className={cn(
                        'rounded-xl py-2 text-center text-sm font-medium transition-all',
                        isRegister ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {t("Register")}
                </Link>
            </div>
        </div>
    );
};

export default AuthTabs;
