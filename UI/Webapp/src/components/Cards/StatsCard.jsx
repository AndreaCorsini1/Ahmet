/**
 *
 */
import React from "react";
import { Row, Col, Card } from "react-bootstrap";


function StatsCard(props) {
  let footer;
  if (props.statsIcon || props.statsIconText)
    footer = (
      <Card.Footer className="footer text-muted">
        <hr />
        <div className="stats"> {props.statsIcon} {props.statsIconText} </div>
      </Card.Footer>
    );

  return (
    <Card border={props.border} className="card-stats">
      <Card.Body>
        <Row>
          <Col xs={5}>
            <div className="icon-big icon-warning">
              {props.bigIcon}
            </div>
          </Col>
          <Col xs={7}>
            <div className="numbers">
              <p>{props.statsText}</p>
              {props.statsValue}
            </div>
          </Col>
        </Row>
      </Card.Body>
      {footer}
    </Card>
  );
}

export default StatsCard;
