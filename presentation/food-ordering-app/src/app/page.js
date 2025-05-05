// app/page.js
'use client';

import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function Home() {
  return (
    <div>
      <header className="bg-dark text-white py-5 text-center">
        <h1>Food Ordering App</h1>
        <p>Order your favorite meals online!</p>
      </header>

      <Container className="my-5">
        <Row>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="/food1.jpg" />
              <Card.Body>
                <Card.Title>Burger</Card.Title>
                <Card.Text>Order a tasty burger today!</Card.Text>
                <Button variant="primary">Order Now</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="/food2.jpg" />
              <Card.Body>
                <Card.Title>Pizza</Card.Title>
                <Card.Text>Freshly baked pizza delivered to your door!</Card.Text>
                <Button variant="primary">Order Now</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="/food3.jpg" />
              <Card.Body>
                <Card.Title>Pasta</Card.Title>
                <Card.Text>A delicious pasta just for you!</Card.Text>
                <Button variant="primary">Order Now</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
