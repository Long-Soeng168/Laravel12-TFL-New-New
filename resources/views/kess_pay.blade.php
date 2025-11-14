<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>

    <title>KESS Payment Test</title>
</head>

<body>
    <div class="mx-auto w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 class="text-2xl font-bold text-center text-gray-800">
            Testing KESS Pay Integration
        </h1>

        <form action="{{ url('/test-create-order') }}" method="POST" class="flex justify-center">
            @csrf
            <button
                type="submit"
                class="px-6 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Create New Order
            </button>
        </form>

        @if (!empty($paymentLink))
        <div class="text-center">
            <a href="{{ $paymentLink }}" target="_blank" rel="noopener noreferrer">
                <button
                    type="button"
                    class="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                    Pay Now
                </button>
            </a>
        </div>
        @endif

        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
            <p class="font-semibold mb-2 text-gray-700">Response:</p>
            <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ is_array($result) ? json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) : $result }}</pre>
        </div>
    </div>

</body>

</html>