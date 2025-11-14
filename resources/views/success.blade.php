@extends('layout')
@section('content')
<div class="row mt-5">
    <div class="col-12">
        <h1>Thanks for your order!</h1>
        <p>
            We appreciate your business!
        </p>
        <a href="/test_stripe">
            <button>Test Payment with Stripe</button>
        </a>
    </div>
</div>
@endsection