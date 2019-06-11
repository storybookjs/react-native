declare module 'global';

// There are no types for graphiql
declare module 'graphiql' {
  const GraphiQL: any;
  export default GraphiQL;
}
