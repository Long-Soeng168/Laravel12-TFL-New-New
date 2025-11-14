<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Successful</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Bootstrap (optional) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background-color: #f4f9f9;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }

        .success-box {
            background: #fff;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }

        .checkmark {
            font-size: 4rem;
            color: #28a745;
        }
    </style>
</head>
<body>
    <div class="success-box">
        <div class="checkmark">✅</div>
        <h2 class="mt-3">Payment Successful</h2>
        <p>Your order has been confirmed.</p>

        @if(request('order_number'))
            <p><strong>Order Number:</strong> {{ request('order_number') }}</p>
        @endif

        <a href="/" class="btn btn-primary mt-3">Back to Home</a>
    </div>
</body>
</html>
