# TODO: Update Edit and View Product Pages UI to Match Add Page

## Tasks
- [ ] Update src/app/products/[id]/edit/page.tsx to match add page design:
  - Add top action bar with "Update Product" and "Cancel" buttons
  - Restructure form into sections: Base Information, Product Images, Pricing & Category, Product Variants
  - Include live preview component on the side
  - Handle variants properly (size, color, fabric, stock per variant)
  - Update handleSubmit to PUT to /api/products/[id]
  - After update, redirect to /products
- [ ] Update src/app/products/[id]/view/page.tsx to match add page design:
  - Add top action bar with "Edit Product" and "Back to Products" buttons
  - Display product data in read-only sections: Base Information, Product Images, Pricing & Category, Product Variants
  - Include product preview on the side
  - Make all fields read-only
- [ ] Test both pages for functionality and UI consistency
