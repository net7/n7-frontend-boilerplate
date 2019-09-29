// Allow loading JSON files from disk

declare module "*.json"
{
  const value: any;
  export default value;
}

// Allow loading JSON from remote URL response

declare module "json!*"
{
  const value: any;
  export default value;
}