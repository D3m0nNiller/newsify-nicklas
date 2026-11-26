import { useState, useRef, useEffect } from "react"
import { FaChevronRight, FaCheck, FaTrash } from "react-icons/fa"
import "./style.scss"
import { useQuery } from "@tanstack/react-query"

export default function Home() {

    const [openCategories, setOpenCategories] = useState([])
    const [closingCategories, setClosingCategories] = useState([])
    const animationLock = useRef([])

    const [savedArticles, setSavedArticles] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("savedArticles")) || []
        } catch {
            return []
        }
    })

    const API_key = import.meta.env.VITE_API_KEY

    useEffect(() => {
        localStorage.setItem("savedArticles", JSON.stringify(savedArticles))
    }, [savedArticles])

    async function newsFetch() {

        const categories = ["Editorial", "Games", "Express", "Podcasts", "Sports", "Climate"]

        const news = await Promise.all(
            categories.map(async (category) => {

                const params = new URLSearchParams({
                    "fq": category,
                    "api-key": API_key
                })

                const response = await fetch(
                    `https://api.nytimes.com/svc/search/v2/articlesearch.json?${params}`
                )

                if (!response.ok) {
                    throw new Error("Failed to fetch news")
                }

                const data = await response.json()

                return {
                    category: category,
                    articles: data.response?.docs ?? []
                }
            })
        )

        return news
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["News"],
        queryFn: newsFetch,
        refetchInterval: 1000 * 60 * 60, //Refetches every 1 hour
        staleTime: 1000 * 60 * 5 //Tells tanstack to consider a new fetch fresh for 5 minutes
    })

    if (isLoading) {
        return <p>Loading weather data...</p>
    }

    if (error) {
        return <p>Something wrong happened while fetching, maybe something is wrong with your internet or while fetching the data</p>
    }

    function toggleSavedArticle(article) {
        const isSaved = savedArticles.some(
            savedArticle => savedArticle._id === article._id
        )

        if (isSaved) {
            setSavedArticles(prev =>
                prev.filter(savedArticle => savedArticle._id !== article._id)
            )
        } else {
            setSavedArticles(prev => [...prev, article])
        }
    }

    function toggleCategory(category) {
        // Prevent multiple clicks during an animation
        if (animationLock.current.includes(category)) return

        // Lock this category immediately
        animationLock.current.push(category)

        const isOpen = openCategories.includes(category)

        if (isOpen) {
            setClosingCategories(prev => [...prev, category])
        } else {
            setOpenCategories(prev => [...prev, category])
        }
    }

    function handleTransitionEnd(e, category) {
        // Only react to the grid-template-rows transition
        if (e.propertyName !== "grid-template-rows") return

        // Check if this category is closing
        if (closingCategories.includes(category)) {
            setOpenCategories(prev =>
                prev.filter(item => item !== category)
            )

            setClosingCategories(prev =>
                prev.filter(item => item !== category)
            )
        }

        // Unlock the category
        animationLock.current =
            animationLock.current.filter(item => item !== category)
    }

    return (
        <section className="news__">

            {data && data.map((category) => {
                const isOpen = openCategories.includes(category.category)
                const isClosing = closingCategories.includes(category.category)

                return (
                    <details
                        className="news__details"
                        key={category.category}
                        open={isOpen}
                    >

                        <summary
                            className="news__summary"
                            onClick={(e) => {
                                e.preventDefault()
                                toggleCategory(category.category)
                            }}
                        >
                            <h1 className="news__catagory">{category.category}</h1>
                            <FaChevronRight className="news__summaryArrow" />
                        </summary>

                        <div
                            className={`news__articles ${isOpen ? "open" : ""} ${isClosing ? "closing" : ""}`}
                            onTransitionEnd={(e) => handleTransitionEnd(e, category.category)}
                        >
                            <div>
                                {category.articles?.map((article) => (
                                    <article key={article._id} className="news__article">
                                        <div className="news__articleImgBox">
                                            <img
                                                src={article.multimedia?.thumbnail?.url}
                                                alt={article.multimedia?.credit || ""}
                                            />
                                        </div>

                                        <div className="news__articleTextWrapper">
                                            <h3 className="news__articleHeader">{article.headline.main}</h3>
                                            <p className="news__articleText">{article.abstract}</p>
                                        </div>

                                        <button
                                            className={`news__saveButton ${savedArticles.some(savedArticle => savedArticle._id === article._id)
                                                ? "saved"
                                                : ""
                                                }`}
                                            onClick={() => toggleSavedArticle(article)}
                                            aria-label={
                                                savedArticles.some(savedArticle => savedArticle._id === article._id)
                                                    ? "Remove saved article"
                                                    : "Save article"
                                            }
                                        >
                                            {savedArticles.some(savedArticle => savedArticle._id === article._id)
                                                ? <FaTrash />
                                                : <FaCheck />
                                            }
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </div>

                    </details>
                )
            })}

        </section>
    )
}
