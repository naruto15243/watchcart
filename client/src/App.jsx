import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000'

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

function App() {
  const [products, setProducts] = useState([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [comparison, setComparison] = useState(null)
  const [movies, setMovies] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [foodItems, setFoodItems] = useState([])
  const [stores, setStores] = useState([])
  const [recommendations, setRecommendations] = useState({ products: [], movies: [], food: [] })
  const [cart, setCart] = useState({ items: [], subtotal: 0, deliveryCharge: 0, total: 0 })
  const [wishlist, setWishlist] = useState([])
  const [orders, setOrders] = useState([])
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [authMessage, setAuthMessage] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comparisonLoading, setComparisonLoading] = useState(false)
  const [movieLoading, setMovieLoading] = useState(true)
  const [foodLoading, setFoodLoading] = useState(true)
  const [recommendationLoading, setRecommendationLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(true)
  const [wishlistLoading, setWishlistLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [storesLoading, setStoresLoading] = useState(true)
  const [orderMessage, setOrderMessage] = useState('')
  const [checkoutForm, setCheckoutForm] = useState({
    deliveryAddress: '123 Main Street, Bengaluru',
    paymentMethod: 'Cash on Delivery',
  })
  const [error, setError] = useState('')

  const fetchRecommendations = async (token) => {
    setRecommendationLoading(true)

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await fetch(
        `${API_URL}${token ? '/api/recommendations/personalized' : '/api/recommendations'}`,
        {
          headers,
        },
      )
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load recommendations')
      }

      setRecommendations({
        products: data.products || [],
        movies: data.movies || [],
        food: data.food || [],
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setRecommendationLoading(false)
    }
  }

  const loadProfile = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load profile')
      }

      setUser(data.user)
    } catch (err) {
      localStorage.removeItem('watchcart_token')
      setUser(null)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('watchcart_token')

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to load products')
        }

        const list = data.data || []
        setProducts(list)

        if (list.length > 0) {
          setSelectedProductId(list[0]._id)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/api/movies`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to load movies')
        }

        setMovies(data.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setMovieLoading(false)
      }
    }

    const fetchFood = async () => {
      try {
        const [restaurantsRes, foodRes] = await Promise.all([
          fetch(`${API_URL}/api/restaurants`),
          fetch(`${API_URL}/api/food`),
        ])

        const restaurantsData = await restaurantsRes.json()
        const foodData = await foodRes.json()

        if (!restaurantsRes.ok || !restaurantsData.success) {
          throw new Error(restaurantsData.message || 'Unable to load restaurants')
        }

        if (!foodRes.ok || !foodData.success) {
          throw new Error(foodData.message || 'Unable to load food items')
        }

        setRestaurants(restaurantsData.data || [])
        setFoodItems(foodData.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setFoodLoading(false)
      }
    }

    const fetchStores = async () => {
      try {
        const response = await fetch(`${API_URL}/api/stores`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to load stores')
        }

        setStores(data.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setStoresLoading(false)
      }
    }

    fetchProducts()
    fetchMovies()
    fetchFood()
    fetchStores()
    fetchRecommendations(token)
    fetchCart(token)
    fetchWishlist(token)
    fetchOrders(token)

    if (token) {
      loadProfile(token)
    }
  }, [])

  useEffect(() => {
    if (!selectedProductId) {
      setComparison(null)
      return
    }

    const fetchComparison = async () => {
      setComparisonLoading(true)
      setError('')

      try {
        const response = await fetch(`${API_URL}/api/compare/${selectedProductId}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to compare prices')
        }

        setComparison(data.data)
      } catch (err) {
        setError(err.message)
        setComparison(null)
      } finally {
        setComparisonLoading(false)
      }
    }

    fetchComparison()
  }, [selectedProductId])

  const selectedProduct =
    products.find((product) => product._id === selectedProductId) || products[0] || null

  const handleAuthFieldChange = (event) => {
    const { name, value } = event.target
    setAuthForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setAuthMessage('')

    try {
      const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login'
      const payload =
        authMode === 'register'
          ? authForm
          : {
              email: authForm.email,
              password: authForm.password,
            }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed')
      }

      localStorage.setItem('watchcart_token', data.token)
      setUser(data.user)
      setAuthMessage(data.message)
      setAuthForm({ name: '', email: '', password: '' })
      fetchRecommendations(data.token)
    } catch (err) {
      setAuthMessage(err.message)
    }
  }

  const fetchCart = async (token) => {
    if (!token) {
      setCart({ items: [], subtotal: 0, deliveryCharge: 0, total: 0 })
      return
    }

    setCartLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load cart')
      }

      setCart(data.data || { items: [], subtotal: 0, deliveryCharge: 0, total: 0 })
    } catch (err) {
      setError(err.message)
    } finally {
      setCartLoading(false)
    }
  }

  const fetchWishlist = async (token) => {
    if (!token) {
      setWishlist([])
      return
    }

    setWishlistLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load wishlist')
      }

      setWishlist(data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setWishlistLoading(false)
    }
  }

  const fetchOrders = async (token) => {
    if (!token) {
      setOrders([])
      setOrdersLoading(false)
      return
    }

    setOrdersLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load orders')
      }

      setOrders(data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setOrdersLoading(false)
    }
  }

  const addToCart = async (item, itemType = 'product') => {
    const token = localStorage.getItem('watchcart_token')

    if (!token) {
      setAuthMessage('Please log in to add items to your cart.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemType,
          itemId: item._id,
          name: item.name || item.title,
          price: item.price || item.discountPrice || 0,
          quantity: 1,
          image: item.images?.[0] || item.image || item.poster || '',
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to add item to cart')
      }

      setAuthMessage('Added to cart successfully.')
      fetchCart(token)
    } catch (err) {
      setAuthMessage(err.message)
    }
  }

  const addToWishlist = async (item, type) => {
    const token = localStorage.getItem('watchcart_token')

    if (!token) {
      setAuthMessage('Please log in to save items to your wishlist.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          itemId: item._id,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to add item to wishlist')
      }

      setAuthMessage('Saved to wishlist.')
      fetchWishlist(token)
    } catch (err) {
      setAuthMessage(err.message)
    }
  }

  const updateCartItemQuantity = async (itemId, quantity) => {
    const token = localStorage.getItem('watchcart_token')

    if (!token) {
      setAuthMessage('Please log in to update your cart.')
      return
    }

    if (quantity <= 0) {
      await removeCartItem(itemId)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to update cart item')
      }

      setAuthMessage('Cart updated successfully.')
      fetchCart(token)
    } catch (err) {
      setAuthMessage(err.message)
    }
  }

  const removeCartItem = async (itemId) => {
    const token = localStorage.getItem('watchcart_token')

    if (!token) {
      setAuthMessage('Please log in to remove items from your cart.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to remove cart item')
      }

      setAuthMessage('Item removed from cart.')
      fetchCart(token)
    } catch (err) {
      setAuthMessage(err.message)
    }
  }

  const handleCheckout = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('watchcart_token')

    if (!token) {
      setOrderMessage('Please log in before placing an order.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(checkoutForm),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to place order')
      }

      setOrderMessage('Order placed successfully!')
      setCheckoutForm({
        deliveryAddress: '123 Main Street, Bengaluru',
        paymentMethod: 'Cash on Delivery',
      })
      fetchCart(token)
      fetchOrders(token)
    } catch (err) {
      setOrderMessage(err.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('watchcart_token')
    setUser(null)
    setAuthMessage('')
    setOrderMessage('')
    fetchRecommendations()
    fetchCart()
    fetchWishlist()
    fetchOrders()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">W</div>
          <span>WatchCart</span>
        </div>
        <nav className="nav">
          <a href="#catalog">Catalog</a>
          <a href="#compare">Compare</a>
          <a href="#movies">Movies</a>
          <a href="#food">Food</a>
        </nav>
        {user ? (
          <div className="user-chip">
            <span>Hi, {user.name}</span>
            <button className="ghost-btn small-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="ghost-btn">Sign in</button>
        )}
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Smart lifestyle platform</p>
            <h1>Shop smarter, watch better, and order faster.</h1>
            <p className="subtitle">
              Compare product prices, browse movie picks, and discover food deals in one
              connected journey.
            </p>
            <div className="cta-row">
              <a href="#catalog" className="primary-btn">Browse catalog</a>
              <a href="#compare" className="secondary-btn">Compare deals</a>
            </div>
            <div className="stats-row">
              <div>
                <strong>{products.length}</strong>
                <span>featured products</span>
              </div>
              <div>
                <strong>{movies.length}</strong>
                <span>movie picks</span>
              </div>
              <div>
                <strong>{foodItems.length}</strong>
                <span>food picks</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>recommendations</span>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-panel">
              <span className="pill">Hot right now</span>
              <h3>{selectedProduct ? selectedProduct.name : 'Loading...'}</h3>
              <ul>
                <li>{selectedProduct ? selectedProduct.category : 'Product'}</li>
                <li>{selectedProduct ? selectedProduct.brand : 'Brand'}</li>
                <li>
                  {selectedProduct ? `${selectedProduct.rating || 0} / 5 rating` : 'Loading'}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="catalog" className="catalog-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2>Discover products</h2>
            </div>
            <button className="secondary-btn small-btn">Seed sample data</button>
          </div>

          {loading ? (
            <div className="status-box">Loading products...</div>
          ) : error ? (
            <div className="status-box error-box">{error}</div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <article
                    key={product._id}
                    className={`product-card ${selectedProductId === product._id ? 'selected' : ''}`}
                    onClick={() => setSelectedProductId(product._id)}
                  >
                    <img src={product.images?.[0]} alt={product.name} />
                    <div className="product-body">
                      <div className="product-meta">
                        <span>{product.category}</span>
                        <span>{product.brand}</span>
                      </div>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="product-footer">
                        <strong>{product.rating || 0} ★</strong>
                        <span>{product.stock} in stock</span>
                      </div>
                      <div className="action-row">
                        <button
                          className="mini-btn primary"
                          onClick={(event) => {
                            event.stopPropagation()
                            addToCart(product, 'product')
                          }}
                        >
                          Add to cart
                        </button>
                        <button
                          className="mini-btn secondary"
                          onClick={(event) => {
                            event.stopPropagation()
                            addToWishlist(product, 'product')
                          }}
                        >
                          Wishlist
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {selectedProduct && (
                <div className="product-detail-card">
                  <img src={selectedProduct.images?.[0]} alt={selectedProduct.name} />
                  <div className="product-detail-body">
                    <p className="eyebrow">Featured item</p>
                    <h3>{selectedProduct.name}</h3>
                    <div className="detail-meta">
                      <span>{selectedProduct.category}</span>
                      <span>{selectedProduct.brand}</span>
                      <span>{selectedProduct.rating || 0} ★</span>
                    </div>
                    <p>{selectedProduct.description}</p>
                    <div className="detail-price-row">
                      <strong>{formatCurrency(selectedProduct.price || 1299)}</strong>
                      <span>{selectedProduct.stock} available</span>
                    </div>
                    <div className="action-row">
                      <button
                        className="primary-btn"
                        onClick={() => addToCart(selectedProduct, 'product')}
                      >
                        Buy now
                      </button>
                      <button
                        className="secondary-btn"
                        onClick={() => addToWishlist(selectedProduct, 'product')}
                      >
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <section id="compare" className="compare-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Price comparison</p>
              <h2>{selectedProduct ? selectedProduct.name : 'Select a product'}</h2>
            </div>
          </div>

          {comparisonLoading ? (
            <div className="status-box">Comparing prices...</div>
          ) : comparison ? (
            <div className="compare-layout">
              <div className="compare-summary">
                <div className="summary-box">
                  <span>Lowest</span>
                  <strong>{formatCurrency(comparison.lowestPrice)}</strong>
                </div>
                <div className="summary-box">
                  <span>Highest</span>
                  <strong>{formatCurrency(comparison.highestPrice)}</strong>
                </div>
                <div className="summary-box">
                  <span>Average</span>
                  <strong>{formatCurrency(comparison.averagePrice)}</strong>
                </div>
              </div>

              <div className="store-list">
                {comparison.stores.map((store) => (
                  <div key={`${comparison.product.id}-${store.store}`} className="store-item">
                    <div>
                      <h4>{store.store}</h4>
                      <p>{store.availability}</p>
                    </div>
                    <div className="store-price">
                      <strong>{formatCurrency(store.price)}</strong>
                      <span>{store.delivery}</span>
                      <small>{store.rating} ★ rating</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="status-box">Select a product to compare prices.</div>
          )}
        </section>

        <section id="movies" className="movies-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Movies</p>
              <h2>Trending picks</h2>
            </div>
          </div>

          {movieLoading ? (
            <div className="status-box">Loading movies...</div>
          ) : (
            <div className="movie-grid">
              {movies.map((movie) => (
                <article key={movie._id} className="movie-card">
                  <img src={movie.poster} alt={movie.title} />
                  <div className="movie-body">
                    <div className="movie-meta">
                      <span>{movie.rating} ★</span>
                      <span>{movie.releaseDate}</span>
                    </div>
                    <h3>{movie.title}</h3>
                    <p>{movie.description}</p>
                    <div className="movie-tags">
                      {movie.genre?.map((genre) => (
                        <span key={`${movie._id}-${genre}`}>{genre}</span>
                      ))}
                    </div>
                    <div className="movie-footer">
                      <small>{movie.streamingInfo}</small>
                    </div>
                    <div className="action-row">
                      <button
                        className="mini-btn primary"
                        onClick={() => addToWishlist(movie, 'movie')}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="food" className="food-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Food ordering</p>
              <h2>Fresh picks near you</h2>
            </div>
          </div>

          {foodLoading ? (
            <div className="status-box">Loading food options...</div>
          ) : (
            <div className="food-layout">
              <div className="restaurant-panel">
                {restaurants.map((restaurant) => (
                  <div key={restaurant._id} className="restaurant-card">
                    <img src={restaurant.image || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80'} alt={restaurant.name} />
                    <div className="restaurant-body">
                      <div className="restaurant-meta">
                        <span>{restaurant.cuisine || 'Popular'}</span>
                        <span>{restaurant.rating || 0} ★</span>
                      </div>
                      <h3>{restaurant.name}</h3>
                      <p>{restaurant.address || 'Fast delivery and quality meals'}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="food-panel">
                {foodItems.map((item) => (
                  <div key={item._id} className="food-card">
                    <img src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80'} alt={item.name} />
                    <div className="food-body">
                      <div className="food-meta">
                        <span>{item.category}</span>
                        <span>{item.rating || 0} ★</span>
                      </div>
                      <h3>{item.name}</h3>
                      <p>{item.description || 'Freshly prepared and ready to enjoy.'}</p>
                      <div className="food-footer">
                        <strong>{formatCurrency(item.price)}</strong>
                        <small>{item.restaurantId?.name || 'Local kitchen'}</small>
                      </div>
                      <div className="action-row">
                        <button
                          className="mini-btn primary"
                          onClick={() => addToCart(item, 'food')}
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="auth-section">
          <div className="auth-card">
            <div className="auth-header">
              <p className="eyebrow">Account</p>
              <h2>{user ? `Welcome back, ${user.name}` : 'Join WatchCart'}</h2>
            </div>

            <div className="auth-toggle">
              <button
                className={authMode === 'login' ? 'toggle-btn active' : 'toggle-btn'}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                className={authMode === 'register' ? 'toggle-btn active' : 'toggle-btn'}
                onClick={() => setAuthMode('register')}
              >
                Register
              </button>
            </div>

            {!user ? (
              <form className="auth-form" onSubmit={handleAuthSubmit}>
                {authMode === 'register' && (
                  <label>
                    <span>Name</span>
                    <input
                      type="text"
                      name="name"
                      value={authForm.name}
                      onChange={handleAuthFieldChange}
                      placeholder="Your name"
                      required
                    />
                  </label>
                )}

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={authForm.email}
                    onChange={handleAuthFieldChange}
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    value={authForm.password}
                    onChange={handleAuthFieldChange}
                    placeholder="••••••••"
                    required
                  />
                </label>

                <button type="submit" className="primary-btn submit-btn">
                  {authMode === 'register' ? 'Create account' : 'Sign in'}
                </button>
              </form>
            ) : (
              <div className="user-panel">
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
              </div>
            )}

            {authMessage && <p className="auth-message">{authMessage}</p>}
          </div>

          <div className="recommendation-card">
            <div className="auth-header">
              <p className="eyebrow">Personalized picks</p>
              <h2>Recommended for you</h2>
            </div>

            {recommendationLoading ? (
              <div className="status-box">Loading recommendations...</div>
            ) : (
              <div className="recommendation-list">
                <div className="recommendation-group">
                  <h3>Products</h3>
                  {recommendations.products.slice(0, 3).map((item) => (
                    <div key={item._id} className="mini-card">
                      <strong>{item.name}</strong>
                      <span>{item.category}</span>
                    </div>
                  ))}
                </div>

                <div className="recommendation-group">
                  <h3>Movies</h3>
                  {recommendations.movies.slice(0, 3).map((item) => (
                    <div key={item._id} className="mini-card">
                      <strong>{item.title}</strong>
                      <span>{item.genre?.join(', ') || 'Featured'}</span>
                    </div>
                  ))}
                </div>

                <div className="recommendation-group">
                  <h3>Food</h3>
                  {recommendations.food.slice(0, 3).map((item) => (
                    <div key={item._id} className="mini-card">
                      <strong>{item.name}</strong>
                      <span>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="cart-wishlist-section">
          <div className="cart-panel">
            <div className="auth-header">
              <p className="eyebrow">Cart</p>
              <h2>Your bag</h2>
            </div>

            {cartLoading ? (
              <div className="status-box">Loading cart...</div>
            ) : cart.items.length === 0 ? (
              <div className="status-box">Your cart is empty.</div>
            ) : (
              <div className="cart-list">
                {cart.items.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-main">
                      <div>
                        <strong>{item.name}</strong>
                        <small>{item.quantity} × {formatCurrency(item.price)}</small>
                      </div>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-stepper">
                        <button
                          type="button"
                          className="quantity-btn"
                          onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          className="quantity-btn"
                          onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="mini-btn secondary"
                        onClick={() => removeCartItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="totals">
                  <div><span>Subtotal</span><strong>{formatCurrency(cart.subtotal)}</strong></div>
                  <div><span>Delivery</span><strong>{formatCurrency(cart.deliveryCharge)}</strong></div>
                  <div className="grand-total"><span>Total</span><strong>{formatCurrency(cart.total)}</strong></div>
                </div>
              </div>
            )}
          </div>

          <div className="wishlist-panel">
            <div className="auth-header">
              <p className="eyebrow">Wishlist</p>
              <h2>Saved items</h2>
            </div>

            {wishlistLoading ? (
              <div className="status-box">Loading wishlist...</div>
            ) : wishlist.length === 0 ? (
              <div className="status-box">No saved items yet.</div>
            ) : (
              <div className="wishlist-list">
                {wishlist.map((item) => (
                  <div key={item._id} className="wishlist-item">
                    <span>{item.type}</span>
                    <strong>{item.itemId}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="stores-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Store partners</p>
              <h2>Marketplace coverage</h2>
            </div>
          </div>

          {storesLoading ? (
            <div className="status-box">Loading store partners...</div>
          ) : (
            <div className="store-grid">
              {stores.map((store) => (
                <article key={store._id} className="store-card">
                  <div className="store-logo">{store.name?.charAt(0) || 'S'}</div>
                  <div className="store-body">
                    <div className="store-header-row">
                      <h3>{store.name}</h3>
                      <span>{store.rating || 0} ★</span>
                    </div>
                    <p>{store.location || 'India'}</p>
                    <small>{store.website || 'Official storefront'}</small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="checkout-section">
          <div className="checkout-card">
            <div className="auth-header">
              <p className="eyebrow">Checkout</p>
              <h2>Complete your order</h2>
            </div>

            <form className="checkout-form" onSubmit={handleCheckout}>
              <label>
                <span>Delivery address</span>
                <textarea
                  value={checkoutForm.deliveryAddress}
                  onChange={(event) =>
                    setCheckoutForm((prev) => ({ ...prev, deliveryAddress: event.target.value }))
                  }
                  rows="3"
                  required
                />
              </label>

              <label>
                <span>Payment method</span>
                <select
                  value={checkoutForm.paymentMethod}
                  onChange={(event) =>
                    setCheckoutForm((prev) => ({ ...prev, paymentMethod: event.target.value }))
                  }
                >
                  <option>Cash on Delivery</option>
                  <option>Card</option>
                  <option>UPI</option>
                  <option>Wallet</option>
                </select>
              </label>

              <button type="submit" className="primary-btn submit-btn">
                Place order
              </button>
            </form>

            {orderMessage && <p className="auth-message">{orderMessage}</p>}
          </div>

          <div className="order-history-card">
            <div className="auth-header">
              <p className="eyebrow">Order history</p>
              <h2>Recent purchases</h2>
            </div>

            {ordersLoading ? (
              <div className="status-box">Loading order history...</div>
            ) : orders.length === 0 ? (
              <div className="status-box">No completed orders yet.</div>
            ) : (
              <div className="order-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="order-main">
                      <strong>Order #{order._id.slice(-6)}</strong>
                      <span>{order.items.length} item(s)</span>
                    </div>
                    <div className="order-meta">
                      <span>{order.paymentMethod}</span>
                      <span>{order.orderStatus}</span>
                    </div>
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="features" className="features">
          <article className="feature-card">
            <div className="feature-icon">✦</div>
            <h3>Smart shopping</h3>
            <p>Compare prices across popular stores and choose the best-value option.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">🎬</div>
            <h3>Movie discovery</h3>
            <p>Find trending films, browse details, and track what to watch next.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">🍔</div>
            <h3>Food ordering</h3>
            <p>Pair your picks with snacks, drinks, and meal deals from local food partners.</p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
