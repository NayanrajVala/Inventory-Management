import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { PaginatedProducts, Product, ProductForm } from "../types/Product";
import { CategoryInterface } from "../types/Category";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<CategoryInterface[]>([]);
  const [page, setPage] = useState(1);
  const [lastpage, setLastpage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const limit = 5;

  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: "",
    quantity: "",
    categoryId: "",
  });

  const fetchProducts = async (currentPage = page) => {
    try {
      const res = await api.get<PaginatedProducts>(
        `/products?page=${currentPage}&limit=${limit}&search=${search}&sortBy=${sortBy}&order=${order}`,
      );
      setProducts(res.data.data);
      setLastpage(res.data.lastPage);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to fetch products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get<CategoryInterface[]>("/category");
      setCategory(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to fetch Category");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, search, sortBy, order]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" || name === "categoryId"
          ? value
          : value,
    }));
  };

  const handleCreate = async () => {
    const { name, price, quantity, categoryId } = form;
    if (!name || !price || !quantity || !categoryId) {
      return alert("all fields are required");
    }

    try {
      await api.post("/products", {
        name,
        price: Number(price),
        quantity: Number(quantity),
        categoryId: Number(categoryId),
      });

      setForm({
        name: "",
        price: "",
        quantity: "",
        categoryId: "",
      });

      fetchProducts();
    } catch (err) {
      console.log(err);
      alert("Creation Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <h2>Products Page</h2>

      <h4>Create Product</h4>
      <div>
        <label>Product Name</label>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <br />

      <div>
        <label>Price</label>
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
      </div>

      <br />

      <div>
        <label>Quantity</label>
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />
      </div>

      <br />
      <div>
        <label>Category</label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {category.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <br />

      <button onClick={handleCreate}>Create</button>

      <button
        onClick={() => {
          navigate("/category");
        }}
      >
        Create Category
      </button>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      <div>
        <label>Search</label>
        <input
          placeholder="Search Product"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <br />
      <div>
        <label>sortBy</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="id">ID</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="quantity">Quantity</option>
          <option value="categoryId">Category</option>
          <option value="createdAt">Created Date</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} | Price:{p.price} | Qty:{p.quantity} | Category:{" "}
            {category.find((c) => c.id === p.categoryId)?.name}
          </li>
        ))}
      </ul>

      <hr />
      <div>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>

        <span>
          Page {page} of {lastpage}
        </span>

        <button
          disabled={page === lastpage}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
