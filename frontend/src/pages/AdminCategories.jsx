import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/admin-categories.css";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:9090/api/categories", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCategories(data.data || []);
      } else {
        setError(data.error || "Failed to load categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.categoryName.trim()) {
      errors.categoryName = "Category name is required";
    }
    if (formData.categoryName.length > 100) {
      errors.categoryName = "Category name must be less than 100 characters";
    }
    if (formData.description && formData.description.length > 500) {
      errors.description = "Description must be less than 500 characters";
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setActionLoading(true);
      const url = editingCategory
        ? `http://localhost:9090/api/categories/${editingCategory.categoryId}`
        : "http://localhost:9090/api/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          categoryName: formData.categoryName,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ categoryName: "", description: "" });
        setFormErrors({});
        fetchCategories();
        showToast(
          editingCategory
            ? "Category updated successfully!"
            : "Category created successfully!",
          "success"
        );
      } else {
        setError(data.error || `Failed to ${editingCategory ? "update" : "create"} category`);
        showToast(
          data.error || `Failed to ${editingCategory ? "update" : "create"} category`,
          "error"
        );
      }
    } catch (err) {
      console.error("Error saving category:", err);
      setError("Failed to save category");
      showToast("Failed to save category", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      description: category.description || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`http://localhost:9090/api/categories/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        fetchCategories();
        showToast("Category deleted successfully!", "success");
      } else {
        setError(data.error || "Failed to delete category");
        showToast(data.error || "Failed to delete category", "error");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category");
      showToast("Failed to delete category", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ categoryName: "", description: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCategories();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:9090/api/categories/search?keyword=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setCategories(data.data || []);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchCategories();
  };

  const showToast = (message, type = "info") => {
    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast-close">×</button>
    `;
    
    // Add to container
    const container = document.querySelector('.toast-container') || createToastContainer();
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    });
  };

  const createToastContainer = () => {
    const container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
    return container;
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && !actionLoading) {
    return (
      <div className="admin-categories loading">
        <div className="spinner-lg"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="admin-categories">
      {/* Header */}
      <div className="categories-header">
        <h1>📂 Category Management</h1>
        <p className="subtitle">Manage product categories</p>
      </div>

      {/* Error Display
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError("")} className="close-btn">
            ×
          </button>
        </div>
      )} */}

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-container">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={handleClearSearch} className="clear-search">
                ×
              </button>
            )}
          </div>
          <button onClick={handleSearch} className="btn-secondary">
            Search
          </button>
        </div>

        <button onClick={handleAddNew} className="btn-primary">
          ➕ Add New Category
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <h3>Total Categories</h3>
            <p className="stat-value">{categories.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Products</h3>
            <p className="stat-value">0</p>
            <p className="stat-subtitle">Across all categories</p>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="categories-table-container">
        <table className="categories-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.categoryId}>
                  <td className="category-id">#{category.categoryId}</td>
                  <td className="category-name">
                    <span className="name">{category.categoryName}</span>
                  </td>
                  <td className="category-description">
                    {category.description ? (
                      <div className="description-text">
                        {category.description}
                      </div>
                    ) : (
                      <span className="empty">No description</span>
                    )}
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => handleEdit(category)}
                      className="btn-icon edit"
                      title="Edit"
                      disabled={actionLoading}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(category.categoryId)}
                      className="btn-icon delete"
                      title="Delete"
                      disabled={actionLoading}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  <div className="empty-state">
                    <div className="empty-icon">📂</div>
                    <h3>No categories found</h3>
                    <p>
                      {searchTerm
                        ? "No categories match your search"
                        : "Get started by creating your first category"}
                    </p>
                    {!searchTerm && (
                      <button onClick={handleAddNew} className="btn-primary">
                        Create Category
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Category Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="close-modal"
                disabled={actionLoading}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="categoryName">
                  Category Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleInputChange}
                  placeholder="e.g., T-Shirts, Hoodies, Pants"
                  className={formErrors.categoryName ? "error" : ""}
                  maxLength={100}
                  disabled={actionLoading}
                />
                {formErrors.categoryName && (
                  <span className="error-message">{formErrors.categoryName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe this category..."
                  rows={4}
                  className={formErrors.description ? "error" : ""}
                  maxLength={500}
                  disabled={actionLoading}
                />
                {formErrors.description && (
                  <span className="error-message">{formErrors.description}</span>
                )}
                <div className="char-count">
                  {formData.description.length}/500 characters
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <span className="spinner-sm"></span>
                      {editingCategory ? "Updating..." : "Creating..."}
                    </>
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;