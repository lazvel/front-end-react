import React, { Component } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import api, { ApiResponse } from '../../api/api';
import ArticleType from '../../types/ArticleType'

interface AddToCartInputProperties {
    article: ArticleType,
}

interface AddToCartInputState {
    quantity: number;
}

export default class AddToCartInput extends Component<AddToCartInputProperties> {
    state: AddToCartInputState;
    
    constructor(props: Readonly<AddToCartInputProperties>) {
        super(props);
        
        this.state = {
            quantity: 1,
        }
    }

    private countChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            quantity: Number(event.target.value), // we do that here like this bcs we have only 1 event happening for quantity
        });
    }

    private addToCart() {
        const data = {
            articleId: this.props.article.articleId,
            quantity: this.state.quantity,
        };

        api('api/user/cart/addToCart', 'post', data)
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                return;
            }

            const event = new CustomEvent('cart.update');
            window.dispatchEvent(event);
        });
    }
    
    render() {
        return (
            
            <Form.Group>
                <Row>
                    <Col xs="7">
                        <Form.Control type="number" min="1" step="1" value={this.state.quantity} 
                            onChange={(e) => this.countChanged(e as any)}/>
                    </Col>
                    <Col xs="5">
                        <Button block variant="secondary"
                            onClick={() => this.addToCart()}>Buy</Button>
                    </Col>
                </Row>
            </Form.Group>
                    
        )
    }
}


