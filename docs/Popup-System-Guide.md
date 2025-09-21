# Pop-up System Guide - Join Team Project

## Table of Contents

1. [Domain Definition](#domain-definition)
2. [Architecture Overview](#architecture-overview)
3. [Component Categories](#component-categories)
4. [Message Components](#message-components)
5. [Service Architecture](#service-architecture)
6. [Implementation Guidelines](#implementation-guidelines)
7. [Integration Patterns](#integration-patterns)
8. [Accessibility Standards](#accessibility-standards)
9. [Best Practices](#best-practices)
10. [Team Guidelines](#team-guidelines)

---

## Domain Definition

### Pop-up Responsibility Scope

The Pop-up domain encompasses all overlay-based UI components that appear above the main application content.

#### Core Components
- **Modals/Dialogs**: Confirmation dialogs, form modals, information displays
- **Toasts/Notifications**: Success messages, error alerts, warning notifications
- **Overlays**: Dropdowns, context menus, image viewers, tooltips

#### Use Cases
- **Edit Forms**: edit-contact, edit-task, edit-user
- **Add Forms**: add-contact, add-task, create-project
- **Confirmations**: Delete confirmations, unsaved changes warnings
- **Notifications**: Form submission results, error handling, system alerts
- **Context Actions**: Right-click menus, dropdown selections
- **Media Display**: Image galleries, document previews

#### Out of Scope
- Main navigation components
- Inline form validation (handled by form components)
- Loading states within existing components
- Static tooltips and help text

---

## Architecture Overview

### System Design Philosophy

The Pop-up system follows a service-driven architecture pattern with centralized management:

```
Components ──▶ Services ──▶ Templates
(Business)     (Logic)      (UI)
```

#### Core Principles
- **Centralized Management**: All pop-ups managed through services
- **Component Isolation**: Pop-up logic separate from business logic
- **Reusability**: Common templates for consistent UX
- **Accessibility First**: WCAG 2.1 compliance built-in
- **Performance Optimized**: Lazy loading and efficient DOM management

#### File Structure Overview
```
shared/
├── components/
│   ├── modal/
│   ├── toast/
│   └── overlay/
├── services/
│   ├── modal.service.ts
│   ├── toast.service.ts
│   └── overlay.service.ts
└── interfaces/
    ├── modal.interface.ts
    ├── toast.interface.ts
    └── overlay.interface.ts
```

---

## Component Categories

### 1. Modal Component

**Purpose**: Full-screen or centered dialogs for forms, confirmations, and detailed content

**Variants**:
- `small`: Simple confirmations, alerts
- `medium`: Standard forms, most dialogs
- `large`: Complex forms, data displays
- `fullscreen`: Mobile optimization, complex workflows

**Key Properties**:
- Title and content configuration
- Size variants (small/medium/large/fullscreen)
- Closable behavior (backdrop/escape/button)
- Header and footer display options
- Custom styling classes

### 2. Toast Component

**Purpose**: Temporary notifications for user feedback

**Types**:
- `success`: Positive actions, confirmations
- `error`: Error messages, failed operations
- `warning`: Important notices, potential issues
- `info`: General information, tips

**Key Properties**:
- Message type and content
- Duration (auto-dismiss or persistent)
- Position (corners of screen)
- Action buttons (optional)
- Close button visibility

### 3. Overlay Component

**Purpose**: Contextual overlays like dropdowns and menus

**Types**:
- `dropdown`: Menu items with actions
- `context-menu`: Right-click activated menus
- `tooltip`: Informational overlays
- `popover`: Rich content overlays

**Key Properties**:
- Trigger element reference
- Content (text or template)
- Position (top/bottom/left/right/auto)
- Close behavior (click/outside-click)
- Arrow indicator

---

## Message Components

### 4. Inline Message Component

**Purpose**: Immediate feedback for form validation and user actions without interrupting workflow

**Types**:
- `validation`: Real-time form field validation feedback
- `error`: Inline error messages for failed operations
- `success`: Confirmation messages for completed actions
- `warning`: Important notices requiring attention
- `info`: Helpful information and tips

**Key Properties**:
- Message type and severity level
- Dismissible or persistent display
- Icon integration for visual hierarchy
- Animation for smooth appearance
- Context-aware positioning

### 5. Alert Banner Component

**Purpose**: System-wide notifications and important announcements

**Types**:
- `system`: Maintenance notices, updates
- `security`: Authentication issues, session warnings
- `connectivity`: Network status, offline mode
- `feature`: New feature announcements

**Key Properties**:
- Full-width or contained layout
- Dismissible with user preference storage
- Action buttons for direct response
- Priority levels for display order
- Sticky positioning options

### Authentication & Validation Use Cases

#### Password Validation Messages
- **Password Mismatch**: "Passwords do not match" - validation type
- **Weak Password**: "Password must contain at least 8 characters" - warning type
- **Password Requirements**: Real-time validation during typing

#### Login/Registration Feedback
- **Invalid Credentials**: "Email or password is incorrect" - error type
- **Account Locked**: "Account temporarily locked due to failed attempts" - error type
- **Registration Success**: "Account created successfully" - success type
- **Email Verification**: "Please check your email to verify account" - info type

#### Session Management
- **Session Expired**: "Your session has expired, please log in again" - warning type
- **Logout Confirmation**: "You have been successfully logged out" - success type
- **Auto-save Status**: "Changes saved automatically" - info type

#### Form Validation Scenarios
- **Required Fields**: "This field is required" - validation type
- **Email Format**: "Please enter a valid email address" - validation type
- **Phone Format**: "Please enter a valid phone number" - validation type
- **Duplicate Data**: "This email is already registered" - error type

#### System Error Handling
- **Network Issues**: "Connection lost, changes not saved" - error type
- **Server Errors**: "Something went wrong, please try again" - error type
- **Maintenance Mode**: "System under maintenance, limited functionality" - warning type

---

## Service Architecture

### Modal Service

**Responsibility**: Manage modal lifecycle and state

**Key Methods**:
- `open(config)`: Create and display modal
- `close(id, result)`: Close specific modal with optional result
- `closeAll()`: Close all active modals
- `isOpen(id)`: Check modal state

**Features**:
- Modal stack management
- Result handling via Observables
- Dynamic component loading
- Memory cleanup

### Toast Service

**Responsibility**: Manage toast notifications queue and display

**Key Methods**:
- `show(config)`: Display custom toast
- `success/error/warning/info(message)`: Convenience methods
- `remove(id)`: Dismiss specific toast
- `clear()`: Remove all toasts

**Features**:
- Queue management
- Auto-dismiss timers
- Position handling
- Observable toast stream

### Overlay Service

**Responsibility**: Manage positioned overlays and their triggers

**Key Methods**:
- `create(config)`: Create positioned overlay
- `close(id)`: Close specific overlay
- `updatePosition(id)`: Recalculate position

**Features**:
- Advanced positioning calculations
- Viewport awareness
- Trigger element tracking
- Outside click detection

### Message Service

**Responsibility**: Manage inline messages and validation feedback

**Key Methods**:
- `showValidation(field, message)`: Display field-specific validation
- `showInline(config)`: Create inline message
- `clearField(fieldName)`: Remove field-specific messages
- `clearAll()`: Remove all inline messages

**Features**:
- Field-specific message tracking
- Real-time validation integration
- Animation coordination
- Form state awareness

### Alert Service

**Responsibility**: Manage system-wide alert banners

**Key Methods**:
- `show(config)`: Display alert banner
- `dismiss(id)`: Remove specific alert
- `showSystem(message)`: System maintenance alerts
- `showSecurity(message)`: Security and session alerts

**Features**:
- Priority-based display order
- User preference storage for dismissals
- Persistent alert management
- Action button integration

---

## Implementation Guidelines

### Component Development Standards

#### File Naming Convention
- Component files: `component-name.component.ts/html/scss`
- Service files: `service-name.service.ts`
- Interface files: `interface-name.interface.ts`

#### Component Structure
- Use Angular standalone components
- Implement OnInit and OnDestroy lifecycle hooks
- Follow reactive programming patterns
- Include comprehensive TypeScript typing

#### Service Integration Pattern
- Inject required services in constructor
- Use service methods for pop-up operations
- Handle results via Observable subscriptions
- Implement proper error handling

### Styling Guidelines

#### CSS Class Naming (BEM)
- Block: `.modal`, `.toast`, `.overlay`
- Element: `.modal__header`, `.toast__message`
- Modifier: `.modal--large`, `.toast--error`

#### Responsive Design
- Mobile-first approach
- Fullscreen modals for small screens
- Touch-friendly sizing (44px minimum)
- Appropriate spacing for different devices

#### CSS Custom Properties Integration
- Use existing color variables from design system
- Leverage typography scale
- Consistent spacing units
- Theme-aware styling

---

## Integration Patterns

### Modal Integration Approach

#### Basic Usage Pattern
1. Inject ModalService in component
2. Call `modalService.open()` with configuration
3. Subscribe to result Observable
4. Handle success/cancel scenarios

#### Form Modal Pattern
- Pass component class and data to modal
- Implement result handling for save/cancel
- Show loading states during operations
- Display success/error toasts based on result

### Toast Integration Approach

#### Service Integration Pattern
- Inject ToastService in services (not components)
- Show toasts from service methods after operations
- Use appropriate toast types for different scenarios
- Consider user context when showing messages

#### Error Handling Pattern
- Show error toasts for failed operations
- Provide actionable messages when possible
- Use persistent toasts for critical errors
- Include retry options where appropriate

### Overlay Integration Approach

#### Trigger-Based Pattern
- Associate overlays with specific trigger elements
- Use ViewChild for element references
- Handle positioning automatically
- Implement proper cleanup

### Message Integration Approach

#### Validation Message Pattern
- Integrate with Angular Reactive Forms
- Show real-time validation feedback
- Clear messages on field focus/blur
- Display multiple validation errors appropriately

#### Authentication Feedback Pattern
- Handle login/logout state changes
- Show session expiration warnings
- Provide password strength indicators
- Display registration success/failure feedback

#### Form Error Handling Pattern
- Collect and display form-level errors
- Show field-specific validation messages
- Handle server-side validation responses
- Provide clear error recovery guidance

### Alert Banner Integration Approach

#### System Notification Pattern
- Display maintenance and update notices
- Handle connectivity status changes
- Show feature announcements
- Manage user dismissal preferences

#### Security Alert Pattern
- Handle authentication failures
- Show session security warnings
- Display account status changes
- Provide security recommendation guidance

---

## Accessibility Standards

### Keyboard Navigation Requirements

#### Essential Key Bindings
- **ESC**: Close active pop-up
- **TAB/SHIFT+TAB**: Navigate focusable elements
- **ENTER/SPACE**: Activate buttons and controls
- **Arrow Keys**: Navigate menu items

#### Focus Management
- Store and restore previous focus
- Focus first interactive element on open
- Trap focus within modal boundaries
- Provide visible focus indicators

### Screen Reader Support

#### ARIA Attributes Requirements
- `role="dialog"` for modals
- `aria-modal="true"` for modal dialogs
- `role="alert"` for error toasts
- `aria-live="polite"` for notifications

#### Labeling Requirements
- Associate titles with `aria-labelledby`
- Use `aria-describedby` for content
- Provide meaningful button labels
- Include status information for screen readers

### Visual Design Requirements

#### Color and Contrast
- Minimum 4.5:1 contrast ratio for text
- Non-color dependent status indicators
- Clear visual hierarchy
- Adequate color differentiation

#### Touch and Interaction
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Clear hover and focus states
- Responsive to user preferences

---

## Best Practices

### Performance Guidelines

#### Lazy Loading Strategy
- Load modal components dynamically
- Defer non-critical overlay content
- Implement efficient DOM manipulation
- Use OnPush change detection where possible

#### Memory Management
- Unsubscribe from Observables in OnDestroy
- Clean up event listeners
- Remove DOM elements properly
- Prevent memory leaks in services

### UX Guidelines

#### Modal Usage Guidelines
- Use appropriate sizes for content
- Avoid stacking multiple modals
- Provide clear action buttons
- Include cancel/close options

#### Toast Guidelines
- Keep messages concise and actionable
- Use appropriate duration for content length
- Limit simultaneous toast count
- Position consistently

#### Animation Guidelines
- Use subtle, meaningful animations
- Respect user motion preferences
- Maintain 60fps performance
- Keep animations under 300ms

### Error Handling Guidelines

#### Graceful Degradation
- Handle service injection failures
- Provide fallback for failed operations
- Log errors for debugging
- Show user-friendly error messages

#### Error Recovery
- Allow users to retry failed operations
- Provide clear instructions for resolution
- Maintain application state during errors
- Offer alternative action paths

---

## Team Guidelines

### Development Workflow

#### Creating New Pop-up Features
1. Define requirements and user scenarios
2. Design component API and interfaces
3. Implement accessibility features from start
4. Create comprehensive tests
5. Document usage patterns
6. Code review with focus on UX and accessibility

#### Using Existing Pop-up System
1. Review this guide for appropriate component type
2. Import required service in your component
3. Follow established integration patterns
4. Handle results and errors appropriately
5. Test across different devices and accessibility tools

### Code Review Checklist

#### Functionality Review
- [ ] Follows established API patterns
- [ ] Proper error handling implemented
- [ ] Memory leaks prevented
- [ ] Performance considerations addressed

#### Accessibility Review
- [ ] Keyboard navigation works correctly
- [ ] Screen reader attributes included
- [ ] Focus management implemented
- [ ] Color contrast requirements met

#### UX Review
- [ ] Consistent with design system
- [ ] Responsive across devices
- [ ] Appropriate animations
- [ ] Clear user feedback

### Communication Guidelines

#### When to Use Pop-ups
- **Modals**: For focused tasks requiring user attention
- **Toasts**: For feedback that doesn't interrupt workflow
- **Overlays**: For contextual actions and additional information
- **Inline Messages**: For real-time validation and immediate feedback
- **Alert Banners**: For system-wide notifications and important announcements

#### When NOT to Use Pop-ups
- Avoid for primary navigation
- Don't interrupt critical user flows
- Avoid for non-essential information
- Don't stack multiple pop-ups
- Don't use inline messages for global notifications
- Avoid alert banners for temporary status updates

#### Message Component Guidelines
- **Use Inline Messages for**: Form validation, field-specific errors, real-time feedback
- **Use Alert Banners for**: System maintenance, security alerts, feature announcements
- **Use Toasts for**: Action confirmations, operation results, temporary notifications
- **Consider User Context**: Choose appropriate severity and persistence levels

### Documentation Maintenance

#### Regular Updates
- Review component usage patterns monthly
- Update examples based on real implementations
- Gather feedback from team members
- Maintain alignment with design system updates

#### Version Control
- Document breaking changes clearly
- Provide migration guides for API changes
- Maintain backward compatibility when possible
- Communicate changes to all team members

---

## Questions and Support

### Implementation Questions
- Review component API documentation
- Check existing usage examples in codebase
- Consult with pop-up domain team member
- Refer to accessibility guidelines

### Design Questions
- Align with established design system
- Consider user experience impact
- Review with UX team if needed
- Test with actual users when possible

### Technical Support
- Check service injection and configuration
- Verify component lifecycle management
- Review error handling implementation
- Test accessibility compliance

---

*Last updated: 2025-09-20*
*Document version: 2.0*
*Responsible: Pop-up Domain Team*