<?php

use App\Http\Controllers\ApplicationInfoController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BannerPositionController;
use App\Http\Controllers\CareerController;
use App\Http\Controllers\CareerSubmitController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentPathController;
use App\Http\Controllers\GarageController;
use App\Http\Controllers\GaragePostController;
use App\Http\Controllers\DtcController;
use App\Http\Controllers\HeadingController;
use App\Http\Controllers\ItemBodyTypeController;
use App\Http\Controllers\ItemBrandController;
use App\Http\Controllers\ItemCategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemModelController;
use App\Http\Controllers\ItemColorController;
use App\Http\Controllers\ItemSizeController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MessageInquiryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PagePositionController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PhoneCompanyController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\PostCategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostViewController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\TeamCategoryController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\VideoPlayListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {


    // === Testing Spatie Role & Permission ===
    Route::group(['middleware' => ['role:admin']], function () {


        Route::get('/admin_test', function () {
            return 'Admin Login Success';
        });
    });
    Route::group(['middleware' => ['permission:create post']], function () {
        Route::get('/permission_test', function () {
            return 'Permission Create post';
        });
    });
    // === End Testing Spatie Role & Permission ===

    Route::middleware(['admin.only', 'auth'])->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });


    // Item Route
    Route::resource('admin/items', ItemController::class);
    Route::post('admin/items/{item}/update', [ItemController::class, 'update']);
    Route::post('admin/items/{item}/update_status', [ItemController::class, 'update_status']);
    Route::delete('admin/items/images/{image}', [ItemController::class, 'destroy_image']);
    Route::get('admin/item_view_counts', [ItemController::class, 'item_view_counts']);
    Route::get('admin/item_view_counts/export', [ItemController::class, 'item_view_counts_export']);

    // Type Route
    Route::resource('admin/types', TypeController::class);
    Route::post('admin/types/{type}/update', [TypeController::class, 'update']);
    Route::post('admin/types/{type}/update_status', [TypeController::class, 'update_status']);

    // Application Info Route
    Route::resource('admin/application_info', ApplicationInfoController::class);
    Route::post('admin/application_info/{application_info}/update', [ApplicationInfoController::class, 'update']);

    // Links Route
    Route::resource('admin/links', LinkController::class);
    Route::post('admin/links/{link}/update', [LinkController::class, 'update']);
    Route::post('admin/links/{link}/update_status', [LinkController::class, 'update_status']);

    // Document Paths Route
    Route::resource('admin/document_paths', DocumentPathController::class);
    Route::post('admin/document_paths/{document_path}/update', [DocumentPathController::class, 'update']);
    Route::post('admin/document_paths/{document_path}/update_status', [DocumentPathController::class, 'update_status']);

    // Partners Route
    Route::resource('admin/partners', PartnerController::class);
    Route::post('admin/partners/{partner}/update', [PartnerController::class, 'update']);
    Route::post('admin/partners/{partner}/update_status', [PartnerController::class, 'update_status']);

    // Phone Company Route
    Route::resource('admin/phone_companies', PhoneCompanyController::class);
    Route::post('admin/phone_companies/{phone_company}/update', [PhoneCompanyController::class, 'update']);
    Route::post('admin/phone_companies/{phone_company}/update_status', [PhoneCompanyController::class, 'update_status']);

    // Dtc Route
    Route::resource('admin/dtcs', DtcController::class);
    Route::post('admin/dtcs/{dtc}/update', [DtcController::class, 'update']);
    Route::post('admin/dtcs/{dtc}/update_status', [DtcController::class, 'update_status']);

    // Courses Route
    Route::resource('admin/courses', CourseController::class);
    Route::post('admin/courses/{course}/update', [CourseController::class, 'update']);
    Route::post('admin/courses/{course}/update_status', [CourseController::class, 'update_status']);

    // Messages Route
    Route::resource('admin/messages', MessageController::class);
    Route::post('admin/messages/{message}/update', [MessageController::class, 'update']);
    Route::post('admin/messages/{message}/update_status', [MessageController::class, 'update_status']);

    // Message Inquiries Route
    Route::resource('admin/message_inquiries', MessageInquiryController::class);
    Route::post('admin/message_inquiries/{message_inquiry}/update', [MessageInquiryController::class, 'update']);
    Route::post('admin/message_inquiries/{message_inquiry}/update_status', [MessageInquiryController::class, 'update_status']);

    // Orders Route
    Route::resource('admin/orders', OrderController::class);
    Route::post('admin/orders/{order}/update', [OrderController::class, 'update']);
    Route::post('admin/orders/{order}/update_status', [OrderController::class, 'update_status']);

    // Video Play Lists Route
    Route::resource('admin/video_play_lists', VideoPlayListController::class);
    Route::post('admin/video_play_lists/{video_play_list}/update', [VideoPlayListController::class, 'update']);
    Route::post('admin/video_play_lists/{video_play_list}/update_status', [VideoPlayListController::class, 'update_status']);

    // Videos Route
    Route::resource('admin/videos', VideoController::class);
    Route::post('admin/videos/{video}/update', [VideoController::class, 'update']);
    Route::post('admin/videos/{video}/update_status', [VideoController::class, 'update_status']);
    Route::post('admin/videos_free_status/{video}/update_status', [VideoController::class, 'videos_free_status']);

    // Item Brands Route
    Route::resource('admin/item_brands', ItemBrandController::class);
    Route::post('admin/item_brands/{item_brand}/update', [ItemBrandController::class, 'update']);
    Route::post('admin/item_brands/{item_brand}/update_status', [ItemBrandController::class, 'update_status']);

    Route::resource('admin/item_sizes', ItemSizeController::class);
    Route::post('admin/item_sizes/{item_size}/update', [ItemSizeController::class, 'update']);
    Route::post('admin/item_sizes/{item_size}/update_status', [ItemSizeController::class, 'update_status']);

    Route::resource('admin/item_colors', ItemColorController::class);
    Route::post('admin/item_colors/{item_color}/update', [ItemColorController::class, 'update']);
    Route::post('admin/item_colors/{item_color}/update_status', [ItemColorController::class, 'update_status']);

    // Item Model Route
    Route::resource('admin/item_models', ItemModelController::class);
    Route::post('admin/item_models/{item_model}/update', [ItemModelController::class, 'update']);
    Route::post('admin/item_models/{item_model}/update_status', [ItemModelController::class, 'update_status']);
    // Item Body Type Route
    Route::resource('admin/item_body_types', ItemBodyTypeController::class);
    Route::post('admin/item_body_types/{item_body_type}/update', [ItemBodyTypeController::class, 'update']);
    Route::post('admin/item_body_types/{item_body_type}/update_status', [ItemBodyTypeController::class, 'update_status']);
    // Item Category Route
    Route::resource('admin/item_categories', ItemCategoryController::class);
    Route::post('admin/item_categories/{item_category}/update', [ItemCategoryController::class, 'update']);
    Route::get('admin/all_item_categories', [ItemCategoryController::class, 'all_item_categories']);
    Route::post('admin/item_categories/{item_category}/update_status', [ItemCategoryController::class, 'update_status']);

    // Shop Route
    Route::resource('admin/shops', ShopController::class);
    Route::post('admin/shops/{shop}/update', [ShopController::class, 'update']);
    Route::get('admin/all_shops', [ShopController::class, 'all_shops']);
    Route::post('admin/shops/{shop}/update_status', [ShopController::class, 'update_status']);
    // Garage Route
    Route::resource('admin/garages', GarageController::class);
    Route::post('admin/garages/{garage}/update', [GarageController::class, 'update']);
    Route::get('admin/all_garages', [GarageController::class, 'all_garages']);
    Route::post('admin/garages/{garage}/update_status', [GarageController::class, 'update_status']);
    // Garage Post Route
    Route::resource('admin/garage_posts', GaragePostController::class);
    Route::post('admin/garage_posts/{garage_post}/update', [GaragePostController::class, 'update']);
    Route::post('admin/garage_posts/{garage_post}/update_status', [GaragePostController::class, 'update_status']);
    Route::delete('admin/garage_posts/images/{image}', [GaragePostController::class, 'destroy_image']);
    Route::get('admin/garage_post_view_counts', [PostViewController::class, 'index']);
    Route::get('admin/garage_post_view_counts/export', [PostViewController::class, 'export']);

    // Project Route
    Route::resource('admin/projects', ProjectController::class);
    Route::post('admin/projects/{project}/update', [ProjectController::class, 'update']);
    Route::post('admin/projects/{project}/update_status', [ProjectController::class, 'update_status']);
    Route::get('admin/all_projects', [ProjectController::class, 'all_projects']);
    Route::delete('admin/projects/images/{image}', [ProjectController::class, 'destroy_image']);

    // Post Category Route
    Route::resource('admin/post_categories', PostCategoryController::class);
    Route::post('admin/post_categories/{post_category}/update', [PostCategoryController::class, 'update']);
    Route::get('admin/all_page_categories', [PostCategoryController::class, 'all_page_categories']);
    Route::post('admin/post_categories/{post_category}/update_status', [PostCategoryController::class, 'update_status']);
    // Post Route
    Route::resource('admin/posts', PostController::class);
    Route::post('admin/posts/{post}/update', [PostController::class, 'update']);
    Route::post('admin/posts/{post}/update_status', [PostController::class, 'update_status']);
    Route::delete('admin/posts/images/{image}', [PostController::class, 'destroy_image']);
    Route::get('admin/post_view_counts', [PostViewController::class, 'index']);
    Route::get('admin/post_view_counts/export', [PostViewController::class, 'export']);

    // Page Position Route
    Route::resource('admin/page_positions', PagePositionController::class);
    Route::post('admin/page_positions/{pagePosition}/update', [PagePositionController::class, 'update']);
    Route::post('admin/page_positions/{pagePosition}/update_status', [PagePositionController::class, 'update_status']);
    // Page Route
    Route::resource('admin/pages', PageController::class);
    Route::post('admin/pages/{page}/update', [PageController::class, 'update']);
    Route::post('admin/pages/{page}/update_status', [PageController::class, 'update_status']);
    Route::delete('admin/pages/images/{image}', [PageController::class, 'destroy_image']);

    // Team Position Route
    Route::resource('admin/positions', PositionController::class);
    Route::post('admin/positions/{position}/update', [PositionController::class, 'update']);
    Route::post('admin/positions/{position}/update_status', [PositionController::class, 'update_status']);
    // Team Category Route
    Route::resource('admin/team_categories', TeamCategoryController::class);
    Route::post('admin/team_categories/{team_category}/update', [TeamCategoryController::class, 'update']);
    Route::post('admin/team_categories/{team_category}/update_status', [TeamCategoryController::class, 'update_status']);
    // Team Route
    Route::resource('admin/teams', TeamController::class);
    Route::post('admin/teams/{team}/update', [TeamController::class, 'update']);
    Route::post('admin/teams/{team}/update_status', [TeamController::class, 'update_status']);
    // Career Route
    Route::resource('admin/careers', CareerController::class);
    Route::post('admin/careers/{career}/update', [CareerController::class, 'update']);
    Route::post('admin/careers/{career}/update_status', [CareerController::class, 'update_status']);
    // Career Route
    Route::resource('admin/career_submits', CareerSubmitController::class);
    Route::post('admin/career_submits/{career_submit}/update', [CareerSubmitController::class, 'update']);
    Route::post('admin/career_submits/{career_submit}/update_status', [CareerSubmitController::class, 'update_status']);

    // Banner Position Route
    Route::resource('admin/banner_positions', BannerPositionController::class);
    Route::post('admin/banner_positions/{bannerPosition}/update', [BannerPositionController::class, 'update']);
    Route::post('admin/banner_positions/{bannerPosition}/update_status', [BannerPositionController::class, 'update_status']);
    // Banner Route
    Route::resource('admin/banners', BannerController::class);
    Route::post('admin/banners/{banner}/update', [BannerController::class, 'update']);
    Route::post('admin/banners/{banner}/update_status', [BannerController::class, 'update_status']);
    Route::delete('admin/banners/remove_image/{banner}', [BannerController::class, 'remove_banner_image']);
    Route::delete('admin/banners/images/{image}', [BannerController::class, 'destroy_image']);

    // Heading Route
    Route::resource('admin/headings', HeadingController::class);
    Route::post('admin/headings/{heading}/update', [HeadingController::class, 'update']);
    Route::post('admin/headings/{heading}/update_status', [HeadingController::class, 'update_status']);

    // Roles & Permissions & User Route
    Route::resource('admin/permissions', PermissionController::class);
    Route::resource('admin/roles', RoleController::class);
    Route::get('admin/all_roles', [RoleController::class, 'all_roles']);
    Route::resource('admin/users', UserController::class);
    Route::post('admin/users/{user}/update', [UserController::class, 'update']);
    // Route::get('/assign-admin', [RoleController::class, 'assignAdmin']);


    // File Upload Route
    Route::get('/admin/ckeditor5', function () {
        return Inertia::render('plugins/ckeditor5/Index');
    });
    Route::get('/admin/my_file_manager', function () {
        return Inertia::render('plugins/file-manager/MyFileManager');
    });
});
