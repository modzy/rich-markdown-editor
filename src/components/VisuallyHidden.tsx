// @ts-nocheck
import * as React from "react";
// const VisuallyHidden = styled.span`
//   position: absolute !important;
//   height: 1px;
//   width: 1px;
//   overflow: hidden;
//   clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
//   clip: rect(1px, 1px, 1px, 1px);
// `;

function VisuallyHidden(props) {
  return <span className="sr-only" {...props} />;
}

export default VisuallyHidden;
