/**
 *
 * Asynchronously loads the component for KafkaPage
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
