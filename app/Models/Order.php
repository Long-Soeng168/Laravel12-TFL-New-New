<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $guarded = [];

    public function order_items()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'id');
    }
    public function buyer()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id', 'id');
    }
}
