<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ItemBrand;
use App\Models\ItemModel;
use Illuminate\Http\Request;


class ModelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $brandId = $request->input('brandId');

        $query = ItemModel::query();

        if (!empty($brandId)) {
            $brand = ItemBrand::find($brandId);
            if ($brand) {
                $query->where('brand_code', $brand->code);
            }
        }

        $models = $query->orderBy('name')->where('status', 'active')->get();

        // Convert to old key structure
        $convertedModels = $models->map(function ($model) {
            return [
                'id'                => $model->id,
                'create_by_user_id' => $model->created_by,
                'name'              => $model->name,
                'name_kh'           => $model->name_kh,
                'brand_id'          => $model->brand_code, // map brand_code to old brand_id
                'image'             => $model->image,
                'status'            => $model->status === 'active' ? 1 : 0,
                'created_at'        => $model->created_at,
                'updated_at'        => $model->updated_at,
            ];
        });

        return response()->json($convertedModels);
    }


    // public function getModelsByBrand(String $brand_id){
    //     $models = BrandModel::where('brand_id', $brand_id)->latest()->get();
    //     return response()->json($models);
    // }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
