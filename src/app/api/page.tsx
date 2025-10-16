export default function API() {
  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">API Documentation</h1>

      <div className="space-y-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Products API</h2>
          <p className="text-gray-600 mb-4">Manage products with categories, pricing, and stock information.</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">GET /api/products</h3>
              <p className="text-gray-600 mb-2">Fetch all products.</p>
              <div className="bg-gray-100 p-4 rounded">
                <pre className="text-sm text-black">
{`curl -X GET http://localhost:3000/api/products`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">POST /api/products</h3>
              <p className="text-gray-600 mb-2">Create a new product.</p>
              <div className="bg-gray-100 p-4 rounded">
                <pre className="text-sm text-black">
{`curl -X POST http://localhost:3000/api/products \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Wireless Headphones",
    "price": 99.99,
    "category": "Electronics",
    "stock": 50
  }'`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Schema</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm text-black">
{`{
  "id": "string",
  "name": "string",
  "price": "number",
  "category": "string",
  "stock": "number"
}`}
            </pre>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Orders API</h2>
          <p className="text-gray-600 mb-4">Manage orders with customer and product details.</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">GET /api/orders</h3>
              <p className="text-gray-600 mb-2">Fetch all orders.</p>
              <div className="bg-gray-100 p-4 rounded">
                <pre className="text-sm text-black">
{`curl -X GET http://localhost:3000/api/orders`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">POST /api/orders</h3>
              <p className="text-gray-600 mb-2">Create a new order.</p>
              <div className="bg-gray-100 p-4 rounded">
                <pre className="text-sm text-black">
{`curl -X POST http://localhost:3000/api/orders \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-123-4567",
      "address": "123 Main St, Anytown, USA"
    },
    "total": 199.99,
    "status": "Pending",
    "items": [
      {
        "productId": "P001",
        "productName": "Smart Watch",
        "category": "Electronics",
        "price": 99.99,
        "quantity": 1
      }
    ]
  }'`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">PUT /api/orders</h3>
              <p className="text-gray-600 mb-2">Update order status.</p>
              <div className="bg-gray-100 p-4 rounded">
                <pre className="text-sm text-black">
{`curl -X PUT http://localhost:3000/api/orders \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "1",
    "status": "Completed"
  }'`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Schema</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm text-black">
{`{
  "id": "string",
  "customer": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string"
  },
  "total": "number",
  "status": "string", // Pending, Shipped, Completed, Cancelled
  "date": "string", // YYYY-MM-DD
  "items": [
    {
      "productId": "string",
      "productName": "string",
      "category": "string",
      "price": "number",
      "quantity": "number"
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
