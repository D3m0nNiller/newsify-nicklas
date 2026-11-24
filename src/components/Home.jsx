
import { FaChevronRight } from "react-icons/fa"
import "./style.scss"
import { useQuery } from "@tanstack/react-query"

export default function Home() {

    const API_key = import.meta.env.VITE_API_KEY

    async function newsFetch() {

        const categories = ["Editorial", "Games", "Express", "Podcasts"]

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
        return <p>Loading...</p>
    }

    if (error) {
        return <p>{error.message}</p>
    }

    return (
        <section className="news__">

            {data && data.map((category) => (
                <details
                    className="news__details"
                    key={category.category}
                >

                    <summary className="news__summary">
                        <h1 className="news__summaryHeader">{category.category}</h1>
                        <FaChevronRight className="news__summaryArrow" />
                    </summary>

                    {category.articles?.map((article) => (
                        <article key={article._id} className="news__article">
                            <h2 className="news__articleHeader">{article.headline.main}</h2>
                            <p className="news__articleText">{article.abstract}</p>
                        </article>
                    ))}

                </details>
            ))}

        </section>
    )
}
