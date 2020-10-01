import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import { ApiConfig } from '../../config/api.config';
import ArticleType from '../../types/ArticleType';
import CategoryType from '../../types/CategoryType';

interface CategoryPageProperties {
  match: {
      params: {
          cId: number;
      }
  }  
}

interface CategoryPageState {
    isUserLoggedIn: boolean;
    category?: CategoryType;
    subcategories?: CategoryType[];
    articles?: ArticleType[];
    message: string;
}

interface CategoryDto {
    categoryId: number;
    name: string;
}

interface ArticleDto {
    articleId: number;
    name: string;
    excerpt?: string;
    description?: string;
    articlePrices?: {
        price: number;
        createdAt: string,
    }[],
    photos?: {
        imagePath: string;
    }[],
}

export class CategoryPage extends Component<CategoryPageProperties> {
    state: CategoryPageState;
    
    constructor(props: Readonly<CategoryPageProperties>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            message: '',
         };
    }
    
    private setLoginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        }));
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setCategoryData(category: CategoryType) {
        this.setState(Object.assign(this.state, {
            category: category,
        }));
    }

    private setSubcategories(subcategories: CategoryType[]) {
        this.setState(Object.assign(this.state, {
            subcategories: subcategories,
        }));
    }

    private setArticles(articles: ArticleType[]) {
        this.setState(Object.assign(this.state, {
            articles: articles,
        }));
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/user/login" />
            );
        }
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faListAlt} />
                            { this.state.category?.name }
                        </Card.Title>
                        { this.printOptionalMessage() }

                        { this.showSubcategories() }
                        
                        { this.showArticles() }
                    </Card.Body>
                </Card>
                
            </Container>
        )
    }

    private printOptionalMessage() {
        if (this.state.message === '') {
            return;
        }
        return (
            <Card.Text>
                { this.state.message } 
            </Card.Text>
        );
    }

    private showSubcategories() {
        if (this.state.subcategories?.length === 0) {
            return;
        }

        return (
            <Row>
                { this.state.subcategories?.map(this.singleCategory) }
            </Row>
        );
    }

    private showArticles() {
        if (this.state.articles?.length === 0) {
            return (
                <div>There are no articles to show in this category.</div>
            );
        }

        return (
            <Row>
                { this.state.articles?.map(this.singleArticle) }
            </Row>
        );
    }

    private singleCategory(category: CategoryType) {
        return (
            <Col lg="3" md="4" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Body>
                    <Card.Title as="p"> { category.name }</Card.Title>
                    <Link to={ `/category/${ category.categoryId }` }
                        className="btn btn-primary btn-block btn-sm">
                        Open category
                    </Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    private singleArticle(article: ArticleType) {
        return (
            <Col lg="4" md="6" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Header>
                        <img alt={ article.name } src={ ApiConfig.PHOTO_PATH + 'small/' + article.imageUrl }
                        className="w-100" />
                    </Card.Header>
                    <Card.Body>
                    <Card.Title as="p"> 
                        <strong>{ article.name }</strong>
                    </Card.Title>
                    <Card.Text>
                        { article.excerpt }
                    </Card.Text>
                    <Card.Text>
                       Price: { Number(article.price).toFixed(2) } EUR
                    </Card.Text>
                    <Link to={ `/article/${ article.articleId }` }
                        className="btn btn-primary btn-block btn-sm">
                        Open article page
                    </Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperties) {
        if (oldProperties.match.params.cId === this.props.match.params.cId) {
            return;
        }

        this.getCategoryData();
    }

    private getCategoryData() {
        api('api/category/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === "login") {
                return this.setLoginState(false);
            }

            if (res.status === 'error') {
                return this.setMessage('Request error. Please try to refresh.');
            }

            const categoryData: CategoryType = {
                categoryId: res.data.categoryId,
                name: res.data.name,
            };

            this.setCategoryData(categoryData);

            const subcategories: CategoryType[] = res.data.categories.map( (category: CategoryDto ) => {
                return {
                    categoryId: category.categoryId,
                    name: category.name,
                }
            });

            this.setSubcategories(subcategories);
        });

        api('api/article/search/', 'post', {
            categoryId: Number(this.props.match.params.cId),
            keywords: "",
            priceMin: 0.01,
            priceMax: Number.MAX_SAFE_INTEGER,
            features: [ ],
            orderBy: "price",
            orderDirection: "ASC",
            
        })
        .then((res: ApiResponse) => {
            if (res.status === "login") {
                return this.setLoginState(false);
            }

            if (res.status === 'error') {
                return this.setMessage('Request error. Please try to refresh.');
            }

            if (res.data.statusCode === 0) {
                this.setMessage('');
                this.setArticles([]);
                return;
            }

            const articles: ArticleType[] = res.data.map( (article: ArticleDto) => {
                const object: ArticleType = {
                    articleId: article.articleId,
                    name: article.name,
                    excerpt: article.excerpt,
                    description: article.description,
                    imageUrl: '',
                    price: 0,
                };

                if (article.photos !== undefined && article.photos.length > 0) {
                    object.imageUrl = article.photos[article.photos.length-1].imagePath;
                }

                if (article.articlePrices !== undefined && article.articlePrices.length > 0) {
                    object.price = article.articlePrices[article.articlePrices.length-1].price;
                }

                return object;
            });

            this.setArticles(articles);
        })
    }
}

export default CategoryPage;
