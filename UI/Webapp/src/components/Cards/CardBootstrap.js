import React from "react";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";

/**
 * Simple styled card from bootstrap.
 */
function CustomCard(props) {
    let subtitle = null, footer;
    if (props.subtitle)
        subtitle = <Card.Title>{props.subtitle}</Card.Title>;
    if (props.footer)
        footer = (<Card.Footer className="text-muted">
          {props.footer}
        </Card.Footer>);

    return (
      <Card border="dark" className="text-center">
        <Card.Header>
          <h4 className="title">{props.title}</h4>
        </Card.Header>
        <Card.Body>
          {subtitle}
          {props.content}
        </Card.Body>
        {footer}
      </Card>
    );
}

CustomCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string
}

export default CustomCard;