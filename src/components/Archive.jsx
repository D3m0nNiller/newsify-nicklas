
import { useState, useRef } from "react"
import { FaChevronRight, FaTrash } from "react-icons/fa"
import "./style.scss"
import Links from "./Links"

export default function Archive() {

    const [savedArticles, setSavedArticles] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("savedArticles")) || []
        } catch {
            return []
        }
    })

    const [openCategories, setOpenCategories] = useState([])
    const [closingCategories, setClosingCategories] = useState([])
    const [swipedArticle, setSwipedArticle] = useState(null)

    const animationLock = useRef([])

    // Group articles by their original fetched category
    const groupedArticles = savedArticles.reduce((groups, article) => {
        const category = article.savedCategory || "Other"

        const existingGroup = groups.find(
            group => group.category === category
        )

        if (existingGroup) {
            existingGroup.articles.push(article)
        } else {
            groups.push({
                category: category,
                articles: [article]
            })
        }

        return groups
    }, [])

    // CATEGORY ANIMATION FUNCTIONS

    function toggleCategory(category) {
        if (animationLock.current.includes(category)) return

        animationLock.current.push(category)

        const isOpen = openCategories.includes(category)

        if (isOpen) {
            setClosingCategories(prev => [...prev, category])
        } else {
            const otherOpenCategories = openCategories.filter(
                item => item !== category
            )

            otherOpenCategories.forEach(item => {
                if (!animationLock.current.includes(item)) {
                    animationLock.current.push(item)
                }
            })

            setClosingCategories(prev => [
                ...new Set([...prev, ...otherOpenCategories])
            ])

            setOpenCategories(prev => [...prev, category])
        }
    }

    function handleTransitionEnd(e, category) {
        if (e.propertyName !== "grid-template-rows") return

        if (closingCategories.includes(category)) {
            setOpenCategories(prev =>
                prev.filter(item => item !== category)
            )

            setClosingCategories(prev =>
                prev.filter(item => item !== category)
            )
        }

        animationLock.current =
            animationLock.current.filter(item => item !== category)
    }

    // ARTICLE SWIPE FUNCTIONS

    function handleTouchStart(e, articleId) {
        const touch = e.touches[0]

        e.currentTarget.dataset.startX = touch.clientX
        e.currentTarget.dataset.articleId = articleId
    }

    function handleTouchEnd(e, articleId) {
        const startX = Number(e.currentTarget.dataset.startX)
        const endX = e.changedTouches[0].clientX
        const difference = startX - endX

        if (difference > 50) {
            setSwipedArticle(articleId)
        } else if (difference < -50) {
            setSwipedArticle(null)
        }
    }

    // REMOVE ARTICLE

    function removeArticle(articleId) {
        const updatedArticles = savedArticles.filter(
            article => article._id !== articleId
        )

        setSavedArticles(updatedArticles)

        localStorage.setItem(
            "savedArticles",
            JSON.stringify(updatedArticles)
        )

        if (swipedArticle === articleId) {
            setSwipedArticle(null)
        }
    }

    return (
        <>
            <section className="archive__">

                <h1 className="archive__header">Newsify</h1>

                {savedArticles.length === 0 ? (
                    <p className="archive__empty">
                        You haven't saved any articles yet.
                    </p>
                ) : (
                    groupedArticles.map(category => {

                        const isOpen = openCategories.includes(category.category)
                        const isClosing = closingCategories.includes(category.category)

                        return (
                            <details
                                className="archive__details"
                                key={category.category}
                                open={isOpen}
                            >
                                <summary
                                    className="archive__summary"
                                    onClick={e => {
                                        e.preventDefault()
                                        toggleCategory(category.category)
                                    }}
                                >
                                    <h2>{category.category}</h2>

                                    <FaChevronRight className="archive__summaryArrow" />
                                </summary>

                                <div
                                    className={`archive__articles ${isOpen ? "open" : ""} ${isClosing ? "closing" : ""}`}
                                    onTransitionEnd={e =>
                                        handleTransitionEnd(e, category.category)
                                    }
                                >
                                    <div>
                                        {category.articles.map(article => (
                                            <div
                                                className="archive__articleWrapper"
                                                key={article._id}
                                            >
                                                <button
                                                    className="archive__removeButton"
                                                    onClick={() => removeArticle(article._id)}
                                                    aria-label="Remove article from archive"
                                                >
                                                    <FaTrash />
                                                </button>

                                                <article
                                                    className={`news__article ${swipedArticle === article._id ? "swiped" : ""
                                                        }`}
                                                    onTouchStart={e =>
                                                        handleTouchStart(e, article._id)
                                                    }
                                                    onTouchEnd={e =>
                                                        handleTouchEnd(e, article._id)
                                                    }
                                                >
                                                    <div className="news__articleImgBox">
                                                        <img
                                                            src={article.multimedia?.thumbnail?.url}
                                                            alt={article.multimedia?.credit || ""}
                                                        />
                                                    </div>

                                                    <div className="news__articleTextWrapper">
                                                        <h3 className="news__articleHeader">
                                                            {article.headline.main}
                                                        </h3>

                                                        <p className="news__articleText">
                                                            {article.abstract}
                                                        </p>
                                                    </div>
                                                </article>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </details>
                        )
                    })
                )}

            </section>
            <Links />
        </>
    )
}
