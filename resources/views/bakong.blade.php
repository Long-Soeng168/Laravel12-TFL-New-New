<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bakong Checkout</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>

<body>
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh; background: linear-gradient(135deg, #667eea, #764ba2);">
        <button
            id="checkout"
            class="btn btn-lg btn-gradient shadow-lg text-white fw-bold px-5 py-3 rounded-4"
            style="background: linear-gradient(90deg, #ff7e5f, #feb47b); border: none; transition: transform 0.2s ease;">
            Launch QR Modal
        </button>
    </div>


    <!-- QR Modal -->
    <div class="modal fade" id="qrCodeModal" tabindex="-1" aria-labelledby="qrModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Scan to Pay</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <canvas id="qrCodeCanvas"></canvas>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- jQuery + Bootstrap Bundle -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- QR Code Libs -->
    <script src="https://github.com/davidhuotkeo/bakong-khqr/releases/download/bakong-khqr-1.0.6/khqr-1.0.6.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const KHQR = typeof BakongKHQR !== 'undefined' ? BakongKHQR : null;

            if (!KHQR) {
                console.error("BakongKHQR or its components are not loaded or defined.");
                return;
            }

            const data = KHQR.khqrData;
            const info = KHQR.IndividualInfo;

            const optionalData = {
                currency: data?.currency?.usd || 'USD',
                amount: 1,
                mobileNumber: "85561561154",
                storeLabel: "PG Market",
                terminalLabel: "pg_market",
                purposeOfTransaction: "oversea",
                languagePreference: "USD",
                merchantNameAlternateLanguage: "ឡុង សឹង",
                merchantCityAlternateLanguage: "សៀមរាប",
            };

            const individualInfo = new info("long_soeng@aclb", "soeng long", "PHNOM PENH", optionalData);
            const khqrInstance = new KHQR.BakongKHQR();
            const individual = khqrInstance.generateIndividual(individualInfo);
            console.log(individual);

            const displayQRCode = () => {
                if (!individual?.data?.qr) {
                    console.error("QR code data is not available.");
                    return;
                }

                const qrCodeCanvas = document.getElementById("qrCodeCanvas");
                if (!qrCodeCanvas) {
                    console.error("QR code canvas element not found.");
                    return;
                }

                QRCode.toCanvas(qrCodeCanvas, individual.data.qr, (error) => {
                    if (error) {
                        console.error("Error generating QR code:", error);
                    }
                });

                const qrCodeModal = new bootstrap.Modal(document.getElementById("qrCodeModal"));
                qrCodeModal.show();
            };

            const checkoutButton = document.getElementById("checkout");
            if (checkoutButton) {
                checkoutButton.addEventListener("click", displayQRCode);
            }

            let checkTransactionInterval;

            $('#qrCodeModal').on('shown.bs.modal', function() {
                const md5Value = individual?.data?.md5;
                if (md5Value) {
                    startQrCodeScanner(md5Value);
                }
            });

            $('#qrCodeModal').on('hidden.bs.modal', function() {
                clearInterval(checkTransactionInterval);
            });

            function startQrCodeScanner(md5Value) {
                checkTransactionInterval = setInterval(() => {
                    fetchTransactionStatus(md5Value);
                }, 5000);
            }

            function fetchTransactionStatus(md5) {
                const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYmYzOTE2OTkxMGI0NDBmMyJ9LCJpYXQiOjE3NTQyOTE5MzQsImV4cCI6MTc2MjA2NzkzNH0.D4WaUFRcVtuYoIpDh1qScb9HSbuRIt2W9g57LDrqTD4'; // move this to backend in production

                fetch('/api/bakong/check', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            md5
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.responseMessage === 'Success') {
                            clearInterval(checkTransactionInterval);
                            window.location.href = '/paymentBakong/success?order_number={{ $order_number ?? "0000" }}';

                            // optional: send Telegram message here
                        } else {
                            console.log("Transaction status unknown.");
                        }
                    })
                    .catch(error => {
                        console.error("Error checking transaction status:", error);
                        clearInterval(checkTransactionInterval);
                    });
            }
        });
    </script>
</body>

</html>