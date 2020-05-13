import React from "react";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";

/**
 * Simple styled card from bootstrap.
 */
function CustomCard(props) {
    let subtitle = null, footer;
    if (props.subtitle)
        subtitle = (<h5 className="mt-1 title">
          <small className="text-muted">
            {props.subtitle}
          </small>
        </h5>);
    if (props.footer)
        footer = (<Card.Footer className="text-muted">
          {props.footer}
        </Card.Footer>);

    return (
      <Card border="dark" className="text-center">
        <Card.Header>
          <h3 className="title">{props.title}</h3>
          {subtitle}
        </Card.Header>
        <Card.Body>
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