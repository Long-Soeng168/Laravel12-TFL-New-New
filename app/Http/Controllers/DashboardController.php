<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Heading;
use App\Models\Item;
use App\Models\ItemDailyView;
use App\Models\Link;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostDailyView;
use App\Models\Project;
use App\Models\User;
use DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function index()
    {
        $post_daily_views_data = DB::table('item_daily_views')
            ->selectRaw('view_date as date, SUM(view_counts) as total')
            ->where('view_date', '>=', now()->subDays(30)->toDateString())
            ->groupBy('view_date')
            ->orderBy('view_date')
            ->get();
        $totalPostViews = ItemDailyView::query()->sum('view_counts');


        $item_counts = Item::count();
        $item_counts = Item::count();
        $post_counts = Post::count();
        $page_counts = Page::count();
        $link_counts = Link::count();
        $banner_counts = Banner::count();
        $user_counts = User::count();
        $role_counts = Role::count();
        $permission_counts = Permission::count();
        $heading_counts = Heading::count();
        $project_counts = Project::count();

        // dd($post_daily_views);
        return Inertia::render('admin/dashboard/Index', [
            'post_daily_views_data' => $post_daily_views_data,
            'featureDatas' => [
                'item_counts' => $item_counts,
                'post_counts' => $post_counts,
                'totalPostViews' => $totalPostViews,
                'page_counts' => $page_counts,
                'link_counts' => $link_counts,
                'banner_counts' => $banner_counts,
                'user_counts' => $user_counts,
                'role_counts' => $role_counts,
                'permission_counts' => $permission_counts,
                'heading_counts' => $heading_counts,
                'project_counts' => $project_counts,
            ]
        ]);
    }
}
