<?php

namespace App\Http\Middleware;

use App\Models\ApplicationInfo;
use App\Models\Garage;
use App\Models\ItemCategory;
use App\Models\Link;
use App\Models\Order;
use App\Models\Post;
use App\Models\Shop;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'app_url' => config('app.url'),
            // 'quote' => ['message' => trim($message), 'author' => trim($author)],
            'user_orders' => $request->user() ? Order::where('user_id', $request->user()->id)
                ->whereIn('status', ['pending', 'paid', 'shipped'])
                ->orderBy('id', 'desc')
                ->get() : [],

            'auth' => [
                'user' => $request->user(),
                'shop' => Shop::find($request->user()?->shop_id) ?? null,
                'garage' => Garage::find($request->user()?->garage_id) ?? null,
                'roles' => $request->user() ? $request->user()->getRoleNames() : [],
                'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name') : [],
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            'locale' => session('locale'),
            'can_switch_language' => config('app.can_switch_language'),
            'CKEDITOR_USE_FILE_FULL_PATH' => env('CKEDITOR_USE_FILE_FULL_PATH'),
            'SHIPPING_PRICE_USD' => env('SHIPPING_PRICE_USD'),

            'application_info' => ApplicationInfo::first(),
            'links' => Link::where('status', 'active')->orderBy('order_index')->get(),
            'item_categories' => ItemCategory::where('status', 'active')->where('parent_code', null)->orderBy('name')->get() ?? [],
            'post_counts' => Post::where('status', 'active')->count(),

            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'warning' => session('warning'),
                'order_id' => session('order_id'),
            ],
        ];
    }
}
