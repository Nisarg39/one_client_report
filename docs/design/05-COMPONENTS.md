# Component Guidelines

## Overview

This document provides guidelines for using and creating components consistently across the Client Report Generator.

---

## Component Library

We use **shadcn/ui** as our primary component library. All components are:
- Pre-styled for our design system
- Fully accessible (ARIA compliant)
- Customizable via Tailwind classes
- Located in `/src/components/ui/`

---

## Button Components

### Primary Button
```tsx
import { Button } from "@/components/ui/button";

<Button className="bg-primary text-primary-foreground">
  Primary Action
</Button>
```

**Usage**: Main CTAs, important actions
**Color**: Orange (#EA9940)
**Examples**: "Generate Report", "Get Started", "Save"

### Secondary Button
```tsx
<Button variant="secondary">
  Secondary Action
</Button>
```

**Usage**: Alternative actions, less important
**Color**: Teal (#307082)
**Examples**: "Cancel", "View Details", "Learn More"

### Outline Button
```tsx
<Button variant="outline">
  Outline Action
</Button>
```

**Usage**: Tertiary actions, complementary to primary
**Examples**: "Cancel", "Back", "Skip"

### Ghost Button
```tsx
<Button variant="ghost">
  Ghost Action
</Button>
```

**Usage**: Minimal actions, navigation
**Examples**: Menu items, close buttons

### Destructive Button
```tsx
<Button variant="destructive">
  Delete
</Button>
```

**Usage**: Destructive actions only
**Examples**: "Delete Account", "Remove Item"

### Button Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### Loading State
```tsx
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Processing...
</Button>
```

---

## Card Components

### Basic Card
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Card with Footer
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Highlighted Card
```tsx
<Card className="border-2 border-primary/30">
  <CardHeader>
    <CardTitle className="text-primary">Featured</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Special content</p>
  </CardContent>
</Card>
```

---

## Form Components

### Input Field
```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
  />
</div>
```

### Select Dropdown
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Form with Validation
```tsx
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const form = useForm();

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="you@example.com" {...field} />
          </FormControl>
          <FormDescription>
            We'll never share your email.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

---

## Dialog/Modal Components

### Basic Dialog
```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description text
      </DialogDescription>
    </DialogHeader>
    <div>
      {/* Dialog content */}
    </div>
  </DialogContent>
</Dialog>
```

### Confirmation Dialog
```tsx
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Badge Components

### Status Badges
```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>
```

### Custom Badge
```tsx
<Badge className="bg-primary text-primary-foreground">
  Featured
</Badge>
```

---

## Table Components

### Data Table
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Client A</TableCell>
      <TableCell>Active</TableCell>
      <TableCell>$500</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Dropdown Menu Components

### Basic Dropdown
```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuItem className="text-destructive">
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Avatar Components

### User Avatar
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Aceternity UI Components

### Grid Background
```tsx
import { GridBackground } from "@/components/aceternity/grid-background";

<GridBackground>
  <div className="z-10">
    {/* Content appears above grid */}
  </div>
</GridBackground>
```

**Usage**: Hero sections, landing pages
**Note**: Content needs `z-10` or higher to appear above grid

---

## Component Composition Patterns

### Card with Action
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <div>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </div>
    <Button variant="ghost" size="sm">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
</Card>
```

### List with Actions
```tsx
<div className="space-y-2">
  {items.map(item => (
    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
      <Button size="sm">View</Button>
    </div>
  ))}
</div>
```

### Form Section
```tsx
<Card>
  <CardHeader>
    <CardTitle>Account Settings</CardTitle>
    <CardDescription>Manage your account preferences</CardDescription>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" />
      </div>
    </form>
  </CardContent>
  <CardFooter>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>
```

---

## Component States

### Loading State
```tsx
// Button
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>

// Card
<Card className="animate-pulse">
  <CardHeader className="space-y-2">
    <div className="h-4 bg-muted rounded" />
    <div className="h-3 bg-muted rounded w-2/3" />
  </CardHeader>
</Card>
```

### Error State
```tsx
<Card className="border-destructive">
  <CardHeader>
    <CardTitle className="text-destructive">Error</CardTitle>
    <CardDescription>Something went wrong</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm">Error message details</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Try Again</Button>
  </CardFooter>
</Card>
```

### Empty State
```tsx
<Card>
  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
    <FileX className="h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="font-semibold mb-2">No reports yet</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Get started by creating your first report
    </p>
    <Button>Create Report</Button>
  </CardContent>
</Card>
```

---

## Do's and Don'ts

### ✅ Do

- Use shadcn/ui components as base
- Customize with Tailwind classes
- Maintain consistent button variants
- Use semantic HTML
- Provide loading and error states
- Include proper labels and ARIA attributes

### ❌ Don't

- Create custom components when shadcn/ui has one
- Override component styles with inline CSS
- Mix different component libraries
- Forget accessibility attributes
- Use non-semantic HTML (divs for buttons)

---

## Creating Custom Components

When creating new components:

1. **Check if shadcn/ui has it** - Use existing when possible
2. **Follow naming conventions** - PascalCase, descriptive names
3. **Location**:
   - UI primitives: `/src/components/ui/`
   - Feature components: `/src/components/features/`
   - Layouts: `/src/components/layout/`
4. **Export pattern**:
```tsx
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  return (
    // Implementation
  );
}
```

5. **Document usage** in this file

---

## Component Checklist

Before using/creating a component:

- [ ] Using shadcn/ui component if available
- [ ] Proper TypeScript types
- [ ] Accessible (keyboard, screen reader)
- [ ] Responsive on mobile
- [ ] Includes loading/error states
- [ ] Follows color system
- [ ] Uses spacing scale
- [ ] Proper semantic HTML
