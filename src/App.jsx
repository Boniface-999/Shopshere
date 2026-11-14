import { useEffect, useMemo, useState } from 'react'
import './App.css'

const categories = [
  { name: 'Fashion', icon: '✦', color: 'peach' },
  { name: 'Electronics', icon: '◉', color: 'blue' },
  { name: 'Home & Living', icon: '⌂', color: 'green' },
  { name: 'Beauty', icon: '♡', color: 'pink' },
  { name: 'Sports', icon: '↗', color: 'yellow' },
  { name: 'Accessories', icon: '◌', color: 'purple' },
]

const products = [
  { id: 1, name: 'Cloud Runner Sneakers', category: 'Fashion', price: 68, rating: '4.9', reviews: 128, emoji: '👟', color: 'lavender', badge: 'Best seller' },
  { id: 2, name: 'Arc Wireless Headphones', category: 'Electronics', price: 84, rating: '4.8', reviews: 96, emoji: '🎧', color: 'sky', badge: 'New' },
  { id: 3, name: 'Everyday Carry Tote', category: 'Accessories', price: 42, rating: '4.7', reviews: 72, emoji: '👜', color: 'sand', badge: '' },
  { id: 4, name: 'Glow Ritual Skincare Set', category: 'Beauty', price: 36, rating: '4.9', reviews: 211, emoji: '✨', color: 'rose', badge: 'Popular' },
  { id: 5, name: 'Sunday Stripe Throw', category: 'Home & Living', price: 54, rating: '4.8', reviews: 84, emoji: '🛋️', color: 'sage', badge: 'New' },
  { id: 6, name: 'Studio Flow Bottle', category: 'Sports', price: 28, rating: '4.7', reviews: 63, emoji: '🧃', color: 'sunny', badge: '' },
]

function Icon({ children }) {
  return <span aria-hidden="true" className="icon">{children}</span>
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [cartItems, setCartItems] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('shopsphere-cart')) || []
  } catch {
    return []
  }
  })
  const [wishListItems, setWishListItems] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('shopsphere-wishlist')) || []
  } catch {
    return []
  }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
    useEffect(() => {
    localStorage.setItem('shopsphere-cart', JSON.stringify(cartItems))
  }, [cartItems])
  useEffect(() => {
    localStorage.setItem('shopsphere-wishlist', JSON.stringify(wishListItems))
  }, [wishListItems])
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const deliveryFee = cartSubtotal >= 50 ? 0 : 5

  const visibleProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return products.filter((product) => {
      const matchesSearch = !query || `${product.name} ${product.category}`.toLowerCase().includes(query)
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  function handleCategorySelect(categoryName) {
    setSelectedCategory((currentCategory) => currentCategory === categoryName ? '' : categoryName)
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function clearFilters() {
    setSearchTerm('')
    setSelectedCategory('')
  }

  function handleAddToCart(product) {
  setCartItems((currentItems) => {
    const existingItem = currentItems.find(
      (item) => item.id === product.id
    )

    if (existingItem) {
      return currentItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    }

    return [...currentItems, { ...product, quantity: 1 }]
  })

  setNotice(`${product.name} was added to your bag.`)
}

function updateCartQuantity(productId, change) {
  setCartItems((currentItems) =>
    currentItems
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + change }
          : item
      )
      .filter((item) => item.quantity > 0)
  )
}

function removeFromCart(productId) {
  setCartItems((currentItems) =>
    currentItems.filter((item) => item.id !== productId)
  )
}
function toggleWishList(product) {
  setWishListItems((currentItems) => {
    const alreadySaved = currentItems.find(
      (item) => item.id === product.id
    )

    if (alreadySaved) {
      return currentItems.filter((item) => item.id !== product.id)
    }

    return [...currentItems, product]
  })
}

return (
  <div className="site-shell">
      <div className="announcement">Free delivery on orders of $50 or more <span>•</span> Easy 30-day returns</div>
      <header className="header container">
        <a className="brand" href="#top" aria-label="ShopSphere home"><span className="brand-mark">S</span><span>ShopSphere</span></a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#shop">Shop</a><a href="#categories">Categories</a>
          <a href="#new">New arrivals</a>
        </nav>
        <div className="header-actions">
  
{/* WISHLIST */}
<div className="header-popover">
  <button
    className="icon-button"
    type="button"
    onClick={() => setIsWishlistOpen(true)}
    aria-label={`Wishlist: ${wishListItems.length} saved items`}
    aria-haspopup="dialog"
  >
    <Icon>♡</Icon>
    {wishListItems.length > 0 && (
      <span className="cart-count">{wishListItems.length}</span>
    )}
  </button>

  <div className="header-preview" role="region" aria-label="Wishlist preview">
    <h3>Your Wishlist ({wishListItems.length})</h3>

    {wishListItems.length === 0 ? (
      <p>Your wishlist is empty.</p>
    ) : (
      <>
        {wishListItems.slice(-3).reverse().map((item) => (
          <div className="preview-item" key={item.id}>
            <span>{item.emoji}</span>
            <div>
              <strong>{item.name}</strong>
              <p>${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}

        <button type="button" onClick={() => setIsWishlistOpen(true)}>
          View wishlist →
        </button>
      </>
    )}
  </div>
</div>

{/* SHOPPING BAG */}
<div className="header-popover">
  <button
    className="icon-button bag-button"
    type="button"
    onClick={() => setIsCartOpen(true)}
    aria-label={`Shopping bag: ${cartCount} items`}
    aria-haspopup="dialog"
  >
    <Icon>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8h14l1 13H4L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
    </Icon>
    {cartCount > 0 && (
      <span className="cart-count">{cartCount}</span>
    )}
  </button>

  <div className="header-preview" role="region" aria-label="Shopping bag preview">
    <h3>Your Bag ({cartCount})</h3>

    {cartItems.length === 0 ? (
      <p>Your shopping bag is empty.</p>
    ) : (
      <>
        {cartItems.slice(-3).reverse().map((item) => (
          <div className="preview-item" key={item.id}>
            <span>{item.emoji}</span>
            <div>
              <strong>{item.name}</strong>
              <p>Qty: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}

        <div className="preview-total">
          <span>Subtotal</span>
          <strong>${cartSubtotal.toFixed(2)}</strong>
        </div>

        <button type="button" onClick={() => setIsCartOpen(true)}>
          View shopping bag →
        </button>
      </>
    )}
  </div>
</div>

</div>
      </header>
      <main id="top">
        <section className="hero-section container">
          <div className="hero-copy"><p className="eyebrow">CURATED FOR YOUR EVERYDAY</p><h1>Find the little things that make life <em>brighter.</em></h1><p className="hero-text">Discover thoughtfully chosen pieces for your style, space, and daily rituals.</p><a className="primary-button" href="#shop">Shop new arrivals <span aria-hidden="true">→</span></a><div className="hero-proof"><strong>12k+</strong><span>happy customers</span><span className="proof-dot">●</span><strong>4.9/5</strong><span>average rating</span></div></div>
          <div className="hero-art" aria-label="A colourful collection of shopping items"><div className="blob blob-one" /><div className="blob blob-two" /><div className="hero-item bag">SHOP<br />SMART</div><div className="hero-item shoe">👟</div><div className="hero-item headphones">🎧</div><div className="hero-item flower">✿</div><div className="hero-tag">New season<br /><strong>is here</strong></div></div>
        </section>
        <section className="search-wrap container" aria-label="Product search"><label className="search-box"><Icon>⌕</Icon><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="What are you looking for?" /><kbd>⌘ K</kbd></label></section>
        <section id="categories" className="container section"><div className="section-heading"><div><p className="eyebrow">BROWSE BY MOOD</p><h2>Shop your favourites</h2></div><button className="text-link" type="button" onClick={() => setSelectedCategory('')}>View all categories <span>→</span></button></div><div className="category-grid">{categories.map((category) => <button className={`category-card ${category.color} ${selectedCategory === category.name ? 'is-selected' : ''}`} type="button" aria-pressed={selectedCategory === category.name} onClick={() => handleCategorySelect(category.name)} key={category.name}><span className="category-icon">{category.icon}</span><span>{category.name}</span><span aria-hidden="true">→</span></button>)}</div></section>
        <section id="shop" className="container section products-section"><div className="section-heading"><div><p className="eyebrow">HANDPICKED FOR YOU</p><h2>{selectedCategory || (searchTerm ? 'Search results' : 'Featured finds')}</h2>{selectedCategory && <p className="filter-summary">Showing {visibleProducts.length} {selectedCategory.toLowerCase()} find{visibleProducts.length === 1 ? '' : 's'}.</p>}</div>{(searchTerm || selectedCategory) ? <button className="text-link" type="button" onClick={clearFilters}>Clear filters <span>×</span></button> : <a id="new" href="#shop">See what’s new <span>→</span></a>}</div>{visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><div className={`product-image ${product.color}`}>{product.badge && <span className="badge">{product.badge}</span>}<button className={'wish-button ' + (wishListItems.some((item) => item.id === product.id) ? 'is-saved' : '')} type="button" onClick={() => toggleWishList(product)} aria-label={`Save ${product.name}`}> {wishListItems.some((item) => item.id === product.id) ? '❤️' : '♡'}</button><span className="product-emoji" aria-hidden="true">{product.emoji}</span></div><div className="product-details"><p>{product.category}</p><h3>{product.name}</h3><div className="product-bottom"><div><strong>${product.price}</strong><span>★ {product.rating} <small>({product.reviews})</small></span></div><button type="button" onClick={() => handleAddToCart(product)} aria-label={`Add ${product.name} to bag`}>+</button></div></div></article>)}</div> : <div className="empty-state"><span>⌕</span><p>No products match your current filters yet.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}</section>
      </main>
    
{isWishlistOpen && (
  <div className="cart-overlay">
    <button
      className="cart-backdrop"
      type="button"
      aria-label="Close wishlist"
      onClick={() => setIsWishlistOpen(false)}
    />

    <aside
      className="cart-drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-title"
    >
      <div className="cart-header">
        <div>
          <p className="eyebrow">YOUR FAVORITES</p>
          <h2> My Wishlist ({wishListItems.length})</h2>
        </div>
        <button
          className="cart-close"
          type="button"
          onClick={() => setIsWishlistOpen(false)}
        >
          ×
        </button>
      </div>

      {wishListItems.length === 0 ? (
        <div className="cart-empty">
          <span>♡</span>
          <h3>Your wishlist is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          </div>
      ) : (
        <div className="cart-items">
          {wishListItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className={`cart-item-image ${item.color}`}>
                {item.emoji}
              </div>

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
              </div>

              <div className="cart-item-actions">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(item)
                    toggleWishList(item)}}
                >
                  Move to Bag
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishList(item)}>
                    Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  </div>
)}

      {isCartOpen && (
  <div className="cart-overlay">
    <button
      className="cart-backdrop"
      type="button"
      aria-label="Close shopping bag"
      onClick={() => setIsCartOpen(false)}
    />

    <aside
      className="cart-drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div className="cart-header">
        <div>
          <p className="eyebrow">YOUR PICKS</p>
          <h2 id="cart-title">Shopping bag ({cartCount})</h2>
        </div>

        <button
          className="cart-close"
          type="button"
          onClick={() => setIsCartOpen(false)}
          aria-label="Close shopping bag"
        >
          ×
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <span>▱</span>
          <h3>Your bag is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <button type="button" onClick={() => setIsCartOpen(false)}>
            Continue shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className={`cart-item-image ${item.color}`}>
                  {item.emoji}
                </div>

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, -1)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <strong>
                    ${(item.price * item.quantity).toFixed(2)}
                  </strong>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div>
              <span>Subtotal</span>
              <strong>${cartSubtotal.toFixed(2)}</strong>
            </div>

            <p>Delivery and taxes are calculated at checkout.</p>

          <button
            className="cart-checkout"
            type="button"
            onClick={() => {
              setIsCartOpen(false)
              setIsCheckoutOpen(true)
              setOrderPlaced(false)
            }}
          >
            Continue to checkout →
          </button>
          </div>
        </>
      )}
    </aside>
  </div>
)}

{isCheckoutOpen && (
  <section className="checkout-page">
    {orderPlaced ? (
      <div className="checkout-success">
        <span>✓</span>
        <h1>Order placed successfully!</h1>
        <p>Thank you for shopping with ShopSphere.</p>
        <button
          type="button"
          onClick={() => {
            setOrderPlaced(false)
            setIsCheckoutOpen(false)
            setCartItems([])
          }}
        >
          Continue shopping
        </button>
      </div>
    ) : (
      <>
      <div className="checkout-heading">
        <button
         className="checkout-back"
         type="button"
         onClick={() => {
          setIsCheckoutOpen(false)
          setIsCartOpen(true)
         }}
        >
          ← Back to bag
        </button>
        <p className="eyebrow"> ALMOST THERE</p>
        <h1>Complete your order</h1>
        <p>Just a few details before your cart is ready.</p>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={(event) => {
          event.preventDefault()
          setOrderPlaced(true)
        }}
        >
          <h2>Delivery information</h2>
          <label>Full name</label><input type="text" placeholder="Your full name" required />
          <label>Email address</label><input type="email" placeholder="Your email" required />
          <label>Phone number</label><input type="tel" placeholder="Your phone number" required />
          <label>Street address</label><input type="text" placeholder="House number and street name" required />
          <label>City</label><input type="text" placeholder="Your city" required />
          <label>State</label><input type="text" placeholder="Your state" required />
          <label>Delivery instructions</label><textarea placeholder="Anything we should know?"/>

          <button type="submit">Place order</button>
        </form>

        <div className="checkout-summary">
          <h2>Order summary</h2>
          <p>Subtotal <strong>${cartSubtotal.toFixed(2)}</strong></p>
          <p>Delivery <strong>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</strong></p>
          <div className="checkout-total">
            <span>Total</span>
            <strong>${(cartSubtotal + deliveryFee).toFixed(2)}</strong>
          </div>
          <p className="checkout-note">This is a demo checkout page. No real payments will be processed.</p>
        </div>
      </div>
      </>
    )}
  </section>
)}

<footer>
  <div className="container">
    <strong>ShopSphere</strong><span>Made for everyday discoveries.</span>
  </div>        
</footer>
      {notice && <div className="toast" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}
    </div>
  )
}

export default App
