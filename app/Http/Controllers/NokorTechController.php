<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Item;
use App\Models\ItemBodyType;
use App\Models\ItemBrand;
use App\Models\ItemCategory;
use App\Models\ItemDailyView;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Shop;
use App\Models\VideoPlayList;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NokorTechController extends Controller
{
    public function index()
    {
        $topBanners = Banner::where('position_code', 'HOME-21/9')->orderBy('order_index')->where('status', 'active')->get();
        $middleBanners = Banner::where('position_code', 'HOME-16/9')->orderBy('order_index')->where('status', 'active')->get();

        $posts = Post::where('status', 'active')->with('images', 'category')->orderBy('id', 'desc')->limit(3)->get();


        $products = Item::with('images', 'shop')
            ->where('status', 'active')
            ->inRandomOrder()
            ->take(12)
            ->get();
        $newArrivalsProducts = Item::with('images', 'shop')->where('status', 'active')->orderBy('id', 'desc')->take(12)->get();


        // $categoriesWithItems = ItemCategory::with([
        //     'items' => function ($query) {
        //         $query->with('images', 'shop')
        //             ->where('items.status', 'active') // Specify 'items' table for status
        //             ->orderBy('id', 'desc')
        //             ->take(12); // Limit to 12 items
        //     },
        //     'children_items' => function ($query) {
        //         $query->with('images',  'shop')
        //             ->where('items.status', 'active') // Specify 'items' table for status
        //             ->orderBy('id', 'desc')
        //             ->take(12); // Limit to 12 child items
        //     }
        // ])
        //     ->orderBy('order_index')->orderBy('name')
        //     ->where('item_categories.status', 'active') // Specify 'item_categories' table for status
        //     ->whereNull('parent_code') // Only main categories (no parent)
        //     ->get();

        // // Merge 'items' and 'children_items'
        // $categoriesWithItems->each(function ($category) {
        //     // Merge and flatten the collections, then reset the keys
        //     $category->all_items = $category->items->merge($category->children_items)
        //         ->sortByDesc('id') // Sort by item ID
        //         ->take(12) // Limit to 12 items
        //         ->values(); // Reset the keys to be sequential

        //     // Optionally, remove the individual 'children_items' and 'items' keys
        //     unset($category->children_items);
        //     unset($category->items);
        // });

        // return $brandsWithItems;
        return Inertia::render("nokor-tech/Index", [
            'topBanners' => $topBanners,
            'middleBanners' => $middleBanners,
            'posts' => $posts,
            'newArrivalsProducts' => $newArrivalsProducts,
            'products' => $products,
            // 'categoriesWithItems' => $categoriesWithItems,
        ]);
    }
    public function shops(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 24);
        $sortBy = $request->input('sortBy', 'order_index');
        $sortDirection = $request->input('sortDirection', 'asc');
        $categoryCode = $request->input('category_code');

        $query = Shop::query();
        $query->with('created_by', 'updated_by');

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%")
                    ->orWhere('address', 'LIKE', "%{$search}%");
            });
        }
        if ($categoryCode) {
            $query->where('category_code', $categoryCode);
        }

        $query->orderBy($sortBy, $sortDirection);
        $query->orderBy('name');
        $query->where('status', 'active');

        $tableData = $query->paginate(perPage: $perPage)->onEachSide(1);

        return Inertia::render('nokor-tech/shops/Index', [
            'tableData' => $tableData,
        ]);
    }



    public function blogs(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');
        $category_code = $request->input('category_code');

        $query = Post::query();

        $query->with('created_by', 'updated_by', 'images', 'category', 'source_detail');

        if ($status) {
            $query->where('status', $status);
        } else {
            $query->where('status', 'active');
        }
        if ($category_code) {
            $query->where('category_code', $category_code);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('title_kh', 'LIKE', "%{$search}%");
            });
        }

        $postCategories = PostCategory::where('status', 'active')->orderBy('order_index')->get();

        $tableData = $query->paginate(perPage: 9)->onEachSide(1);
        return Inertia::render('nokor-tech/blogs/Index', [
            'tableData' => $tableData,
            'postCategories' => $postCategories,
        ]);
    }

    public function blog_show($id)
    {
        $post = Post::find($id);
        $postCategories = PostCategory::where('status', 'active')->withCount('posts')->orderBy('order_index')->get();
        $relatedPosts = Post::with('category', 'images')->where('id', '!=', $id)->where('category_code', $post->category_code)->orderBy('id', 'desc')->limit(6)->get();

        return Inertia::render("nokor-tech/blogs/Show", [
            "post" => $post->load('images', 'category'),
            'postCategories' => $postCategories,
            'relatedPosts' => $relatedPosts,
        ]);
    }

    public function products(Request $request)
    {
        $search = $request->input('search', '');
        $brand_code = $request->input('brand_code', '');
        $perPage = $request->input('perPage', 25);
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $category_code = $request->input('category_code', '');
        $body_type_code = $request->input('body_type_code', '');

        $page = $request->query('page', 1);

        $query = Item::query();
        $query->with('created_by', 'updated_by', 'images', 'category', 'shop');

        if ($category_code) {
            $category = ItemCategory::with('children')->where('code', $category_code)->first();

            if ($category) {
                // make sure all children are loaded recursively
                $category->load('children.children.children'); // or go deeper as needed

                $categoryCodes = $category->getAllCategoryCodes();

                $query->whereIn('category_code', $categoryCodes);
            }
        }

        if ($brand_code) {
            $query->where('brand_code', $brand_code);
        }
        if ($body_type_code) {
            $query->where('body_type_code', $body_type_code);
        }

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy($sortBy, $sortDirection);
        $query->where('status', 'active');

        $tableData = $query->paginate(perPage: $perPage)->onEachSide(1);

        $selected_category = ItemCategory::with('parent.parent.parent')->where('status', 'active')->where('code', $category_code)->orderBy('name')->first() ?? [];
        $selected_brand = ItemBrand::where('status', 'active')->where('code', $brand_code)->orderBy('name')->first() ?? [];

        $allBrands = $selected_category ? $selected_category->getAllBrandsAttribute() : [];
        // return $allBrands;

        $sub_categories_query = ItemCategory::query();
        if ($category_code) {
            $sub_categories_query->where('parent_code', $category_code);
        } else {
            $sub_categories_query->where('parent_code', null);
        }

        $sub_categories = $sub_categories_query->where('status', 'active')->orderBy('name')->get() ?? [];

        $item_body_types = ItemBodyType::orderBy('order_index')->orderBy('name')
            ->withCount('items')
            ->where('status', 'active') // Specify 'item_categories' table for status
            ->get();
        $productListBanners = Banner::where('position_code', 'PRODUCT_SEARCH')->orderBy('order_index')->where('status', 'active')->get();

        $PaginateProp = $tableData->toArray(); // To access paginate property
        // return $PaginateProp['next_page_url'];

        return Inertia::render('nokor-tech/products/Index', [
            'tableData' => Inertia::merge($tableData->items()),
            'page' => $page,
            'next_page_url' => $PaginateProp['next_page_url'],

            'category_brands' => $allBrands,
            'item_body_types' => $item_body_types,
            'productListBanners' => $productListBanners,
            'sub_categories' => $sub_categories,
            'selected_category' => $selected_category,
            'selected_brand' => $selected_brand,
            'q_category_code' => $category_code,
        ]);
    }

    public function shop_show($id, Request $request)
    {
        $search = $request->input('search', '');
        $brand_code = $request->input('brand_code', '');
        $perPage = $request->input('perPage', 25);
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $category_code = $request->input('category_code', '');
        $body_type_code = $request->input('body_type_code', '');

        $query = Item::query();
        $query->with('created_by', 'updated_by', 'images', 'category', 'shop');

        if ($category_code) {
            // get category and its children codes
            $category = ItemCategory::with('children')->where('code', $category_code)->first();

            if ($category) {
                $categoryCodes = collect([$category->code])
                    ->merge($category->children->pluck('code'))
                    ->toArray();

                $query->whereIn('category_code', $categoryCodes);
            }
        }

        if ($brand_code) {
            $query->where('brand_code', $brand_code);
        }
        if ($body_type_code) {
            $query->where('body_type_code', $body_type_code);
        }

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy($sortBy, $sortDirection);
        $query->where('status', 'active');
        $query->where('shop_id', $id);

        $tableData = $query->paginate(perPage: $perPage)->onEachSide(1);

        // $item_brands = ItemBrand::orderBy('order_index')->orderBy('name')
        //     ->withCount('items')
        //     ->where('status', 'active') // Specify 'item_categories' table for status
        //     ->get();
        // $item_body_types = ItemBodyType::orderBy('order_index')->orderBy('name')
        //     ->withCount('items')
        //     ->where('status', 'active') // Specify 'item_categories' table for status
        //     ->get();
        // $productListBanners = Banner::where('position_code', 'PRODUCT_SEARCH')->orderBy('order_index')->where('status', 'active')->get();

        return Inertia::render('nokor-tech/shops/Show', [
            'shop' => Shop::find($id),
            'tableData' => $tableData,
            // 'item_brands' => $item_brands,
            // 'item_body_types' => $item_body_types,
            // 'productListBanners' => $productListBanners,
        ]);
    }


    public function online_trainings(Request $request)
    {
        $search = $request->input('search', '');
        $brand_code = $request->input('brand_code', '');
        $perPage = $request->input('perPage', 25);
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');

        $query = VideoPlayList::query();
        $query->with('created_by', 'updated_by');
        $query->withCount('videos');



        if ($brand_code) {
            $query->where('brand_code', $brand_code);
        }

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy($sortBy, $sortDirection);
        $query->where('status', 'active');

        $tableData = $query->paginate(perPage: $perPage)->onEachSide(1);

        return Inertia::render('nokor-tech/online_trainings/Index', [
            'tableData' => $tableData,
        ]);
    }
    public function online_training_show($id)
    {
        $videoPlaylist = VideoPlayList::find($id);

        $relatedPosts = Post::with('category', 'images')->where('id', '!=', $id)->orderBy('id', 'desc')->limit(6)->get();

        return Inertia::render("nokor-tech/online_trainings/Show", [
            "videoPlaylist" => $videoPlaylist,
            'relatedPosts' => $relatedPosts,
        ]);
    }

    public function product_show($id)
    {
        $itemShow = Item::find($id);

        $relatedItemsQuery = Item::query();

        $relatedItemsQuery->with(['category', 'images', 'shop']);

        $relatedItemsQuery->where('id', '!=', $id);

        if ($itemShow->category_code) {
            $relatedItemsQuery->where('category_code', $itemShow->category_code);
        }

        $relatedItems = $relatedItemsQuery
            ->orderByDesc('id')
            ->limit(12)
            ->get();

        $date = now()->toDateString();
        $view = ItemDailyView::firstOrCreate(
            ['item_id' => $id, 'view_date' => $date],
            ['view_counts' => 0],
        );
        $view->increment('view_counts');

        $itemShow->update([
            'total_view_counts' => $itemShow->total_view_counts + 1,
        ]);

        return Inertia::render("nokor-tech/products/Show", [
            "itemShow" => $itemShow->load('created_by', 'updated_by', 'images', 'category', 'brand', 'shop', 'colors_with_details', 'sizes_with_details'),
            'relatedItems' => $relatedItems,
        ]);
    }
    public function checkout()
    {
        // return Inertia::render("nokor-tech/cart/Checkout");
        return Inertia::render("nokor-tech/cart/Checkout");
    }
    public function success()
    {
        return Inertia::render("nokor-tech/cart/Success");
    }
    public function download_app()
    {
        return Inertia::render("nokor-tech/DownloadApp");
    }
    public function privacy()
    {
        $privacies = Page::with('children')->where('code', 'PRIVACY-POLICY-PAGE')->where('status', 'active')->orderBy('order_index')->first();
        // return $privacies;
        return Inertia::render("nokor-tech/Privacy", [
            'privacies' => $privacies,
        ]);
    }
    public function about()
    {
        $about = Page::with('children')->where('code', 'ABOUT')->where('status', 'active')->orderBy('order_index')->first();
        $whyChooseUs = Page::with('children')->where('code', 'WHY-CHOOSE-US')->where('status', 'active')->orderBy('order_index')->first();
        $buildForEveryone = Page::with('children')->where('code', 'BUILD-FOR-EVERYONE')->where('status', 'active')->orderBy('order_index')->first();
        $getInTouch = Page::with('children')->where('code', 'GET-IN-TOUCH')->where('status', 'active')->orderBy('order_index')->first();
        $privacyPolicy = Page::with('children')->where('code', 'PRIVACY-POLICY')->where('status', 'active')->orderBy('order_index')->first();
        $getStartedNow = Page::with('children')->where('code', 'GET-STARTED-NOW')->where('status', 'active')->orderBy('order_index')->first();
        // return $about;
        return Inertia::render("nokor-tech/About", [
            "about" => $about,
            "whyChooseUs" => $whyChooseUs,
            "buildForEveryone" => $buildForEveryone,
            "getInTouch" => $getInTouch,
            "privacyPolicy" => $privacyPolicy,
            "getStartedNow" => $getStartedNow,
        ]);
    }
    public function shop_terms_and_conditions()
    {
        $about = Page::with('children')->where('code', 'SHOP-TERMS-AND-CONDITIONS')->where('status', 'active')->orderBy('order_index')->first();
        // return $about;
        return Inertia::render("nokor-tech/About", [
            "about" => $about,
        ]);
    }

    public function contact()
    {
        $contactPage = Page::with('images')->where('position_code', 'CONTACT')->where('status', 'active')->orderBy('order_index')->first();

        return Inertia::render("nokor-tech/Contact", [
            "contactPage" => $contactPage
        ]);
    }
    public function documents()
    {
        return Inertia::render("nokor-tech/Documents");
    }
}
