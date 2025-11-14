<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemBodyType;
use App\Models\ItemBrand;
use App\Models\ItemCategory;
use App\Models\ItemImage;
use App\Models\ItemModel;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Image;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\Auth;

use function PHPUnit\Framework\isEmpty;

class ShopController extends Controller
{
    public function index()
    {
        $shops = Shop::paginate(10);

        return response()->json($shops);
    }

    public function user_shop(Request $request)
    {
        $user = Auth::user();
        $shop = Shop::where('id', $user->shop_id)->first();
        if (!$shop) {
            return response()->json(['message' => 'No shop found for this user'], 404);
        }
        return response()->json($shop);
    }
    public function store(Request $request)
    {
        // Validate incoming request  
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4000', // Validate logo image
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4000', // Validate banner image
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 400);
        }

        $userId = $request->user()->id;

        try {
            $logoName = null;
            $image_file = $request->file('logo');
            if ($image_file) {
                try {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/shops', 600);
                    $logoName = $created_image_name;
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fail to Save Image.',
                    ], 500);
                }
            }

            $bannerName = null;
            $banner_file = $request->file('banner');
            if ($banner_file) {
                try {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/shops', 1200);
                    $bannerName = $created_image_name;
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fail to Save Image.',
                    ], 500);
                }
            }

            $shop = Shop::create([
                'name' => $request->input('name'),
                'short_description' => $request->input('description'),
                'address' => $request->input('address'),
                'phone' => $request->input('phone'),
                'logo' => $logoName,
                'banner' => $bannerName,
                'status' => 'active',
                'owner_user_id' => $userId,
                'created_by' => $request->user()->id,
                'updated_by' => $request->user()->id,
            ]);

            $user = User::find($userId);
            $user->update([
                'shop_id' => $shop->id,
            ]);
            $user->assignRole('Shop');

            return response()->json([
                'success' => true,
                'message' => 'Shop created successfully',
                'shop' => $shop
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating shop: ' . $e->getMessage()
            ], 500);
        }
    }


    public function show(string $id)
    {
        $shop = Shop::with('owner')->findOrFail($id);

        // Convert new key structure to old key structure
        $oldKeyShop = [
            'id'                 => $shop->id,
            'owner_user_id'      => $shop->owner_user_id,
            'name'               => $shop->name,
            'logo'               => $shop->logo,
            'banner'             => $shop->banner,
            'description'        => $shop->short_description,
            'description_kh'     => $shop->short_description_kh,
            'phone'              => $shop->phone,
            'cellcard'           => null,
            'smart'              => null,
            'metfone'            => null,
            'address'            => $shop->address,
            'vat_percent'        => null,
            'exchange_rate_riel' => null,
            'status'             => $shop->status === 'active' ? 1 : 0,
            'created_at'         => $shop->created_at,
            'updated_at'         => $shop->updated_at,
            'owner'              => $shop->owner ? [
                'id'               => $shop->owner->id,
                'name'             => $shop->owner->name,
                'email'            => $shop->owner->email,
                'shop_id'          => $shop->owner->shop_id,
                'garage_id'        => $shop->owner->garage_id,
                'phone'            => $shop->owner->phone,
                'gender'           => $shop->owner->gender,
                'date_of_birth'    => null,
                'address'          => null,
                'image'            => $shop->owner->image,
                'add_by_user_id'   => $shop->owner->created_by ?? null,
                'status'           => $shop->owner->status ?? 1,
                'email_verified_at' => $shop->owner->email_verified_at,
                'created_at'       => $shop->owner->created_at,
                'updated_at'       => $shop->owner->updated_at,
            ] : null,
        ];

        return response()->json($oldKeyShop);
    }


    public function edit($id)
    {
        $shop = Shop::findOrFail($id);
        return $shop;
        // return view('admin.shops.edit', compact('dtc'));
    }



    public function update(Request $request, $id)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20048', // Optional logo
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20048', // Optional banner
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 400);
        }

        try {
            // Find the shop
            $shop = Shop::findOrFail($id);
            if ($shop->id != $request->user()->shop_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorize!'
                ], 401);
            }

            $logoName = null;
            $image_file = $request->file('logo');
            if ($image_file) {
                try {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/shops', 600);
                    $logoName = $created_image_name;
                    if ($shop->logo && $created_image_name) {
                        ImageHelper::deleteImage($shop->logo, 'assets/images/shops');
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fail to Save Image.',
                    ], 500);
                }
            }

            $bannerName = null;
            $banner_file = $request->file('banner');
            if ($banner_file) {
                try {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/shops', 1200);
                    $bannerName = $created_image_name;
                    if ($shop->banner && $created_image_name) {
                        ImageHelper::deleteImage($shop->banner, 'assets/images/shops');
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fail to Save Image.',
                    ], 500);
                }
            }

            // Update other shop details
            $shop->update([
                'name' => $request->input('name'),
                'short_description' => $request->input('description'),
                'address' => $request->input('address'),
                'phone' => $request->input('phone'),
                'logo' => $logoName,
                'banner' => $bannerName,
                'updated_by' => $request->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Shop updated successfully',
                'shop' => $shop
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating shop: ' . $e->getMessage()
            ], 500);
        }
    }


    public function destroy($id)
    {
        Shop::findOrFail($id)->delete();

        return redirect()->route('admin.shops.index')->with('success', 'DTC deleted successfully.');
    }

    //Products

    public function storeProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required',
            'categoryId' => 'required',
            'bodyTypeId' => 'nullable|required',
            'brandId' => 'nullable|required',
            'brandModelId' => 'nullable|required',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:4000',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:4048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 400);
        }

        try {
            $category_code = ItemCategory::find($request->input('categoryId')) ?? null;
            $brand_code = ItemBrand::find($request->input('brandId')) ?? null;
            $body_type_code = ItemBodyType::find($request->input('bodyTypeId')) ?? null;
            $model_code = ItemModel::find($request->input('brandModelId')) ?? null;

            $created_product = Item::create([
                'name' => $request->input('name'),
                'price' => $request->input('price'),
                'short_description' => $request->input('description'),
                'category_code' => $category_code,
                'body_type_code' => $body_type_code,
                'brand_code' => $brand_code,
                'model_code' => $model_code,
                'created_by' =>  $request->user()->id,
                'updated_by' => $request->user()->id,
                'shop_id' => $request->user()->shop_id,
                "status" => 'active',
            ]);

            // Multiple Images
            $image_files = $request->file('images');
            if ($image_files) {
                try {
                    foreach ($image_files as $image) {
                        $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/items', 600);
                        ItemImage::create([
                            'image' => $created_image_name,
                            'item_id' => $created_product->id,
                        ]);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fail to Save Image.',
                    ], 500);
                }
            }
            // Single Image
            $image_file = $request->file('image');
            if ($image_file) {
                try {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/items', 600);
                    ItemImage::create([
                        'image' => $created_image_name,
                        'item_id' => $created_product->id,
                    ]);
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fail to Save Image.',
                    ], 500);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'product' => $created_product
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating Product: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateProduct(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required',
            'categoryId' => 'required',
            'bodyTypeId' => 'nullable|required',
            'brandId' => 'nullable|required',
            'brandModelId' => 'nullable|required',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:4000',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:4048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 400);
        }

        try {
            $category_code = ItemCategory::find($request->input('categoryId')) ?? null;
            $brand_code = ItemBrand::find($request->input('brandId')) ?? null;
            $body_type_code = ItemBodyType::find($request->input('bodyTypeId')) ?? null;
            $model_code = ItemModel::find($request->input('brandModelId')) ?? null;

            $product = Item::find($id);
            if ($product->shop_id != $request->user()->shop_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorize!'
                ], 401);
            }
            
            $product->update([
                'name' => $request->input('name'),
                'price' => $request->input('price'),
                'short_description' => $request->input('description'),
                'category_code' => $category_code,
                'body_type_code' => $body_type_code,
                'brand_code' => $brand_code,
                'model_code' => $model_code,
                'updated_by' => $request->user()->id,
            ]);

            // Multiple Images
            $image_files = $request->file('images');
            if ($image_files) {
                try {
                    foreach ($image_files as $image) {
                        $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/items', 600);
                        ItemImage::create([
                            'image' => $created_image_name,
                            'item_id' => $product->id,
                        ]);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fail to Save Image.',
                    ], 500);
                }
            }
            // Single Image
            $image_file = $request->file('image');
            if ($image_file) {
                try {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/items', 600);
                    ItemImage::create([
                        'image' => $created_image_name,
                        'item_id' => $product->id,
                    ]);
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fail to Save Image.',
                    ], 500);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'product' => $product
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating Product: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteProduct($id)
    {
        try {
            $product = Item::findOrFail($id);
            if (count($product->images) > 0) {
                foreach ($product->images as $image) {
                    ImageHelper::deleteImage($image->image, 'assets/images/items');
                }
            }
            $product->delete();
            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting product: ' . $e->getMessage()
            ], 500);
        }
    }
}
