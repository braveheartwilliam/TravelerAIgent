import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import Content from "./dropdown-content.svelte";
import Item from "./dropdown-item.svelte";
import Label from "./dropdown-label.svelte";
import Separator from "./dropdown-separator.svelte";
import Trigger from "./dropdown-trigger.svelte";

const Root = DropdownMenuPrimitive.Root;

export {
  Root,
  Content,
  Item,
  Label,
  Separator,
  Trigger,
  //
  Root as DropdownMenu,
  Content as DropdownMenuContent,
  Item as DropdownMenuItem,
  Label as DropdownMenuLabel,
  Separator as DropdownMenuSeparator,
  Trigger as DropdownMenuTrigger,
};
