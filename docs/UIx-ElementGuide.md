# UI/UX Element Guide - Join Team Project

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Philosophy](#architecture-philosophy)
3. [Design System Foundation](#design-system-foundation)
4. [Shared Component Library](#shared-component-library)
5. [Implementation Guidelines](#implementation-guidelines)
6. [Asset Management](#asset-management)
7. [Development Workflow](#development-workflow)

---

## Project Overview

The Join Team Project is an Angular 20.1.0 application built with a component-driven architecture using standalone components. The project implements a comprehensive design system with reusable UI components that ensure consistency across all application sections.

### Core Technologies
- **Framework**: Angular 20.1.0 with TypeScript
- **Styling**: SCSS with CSS Custom Properties
- **Backend**: Firebase/Firestore integration
- **Font System**: Inter font family (400, 500, 600, 700 weights)
- **Code Quality**: ESLint, Prettier, Stylelint

### Project Structure
```
shared/components/ - Reusable UI elements
shared/services/   - Business logic services
core/interfaces/   - TypeScript definitions
main/             - Feature modules
styles/           - Design system foundation
```

---

## Architecture Philosophy

### Component-Driven Development
The application follows a strict component-driven approach where UI elements are:
- **Reusable**: Components work across different contexts
- **Configurable**: Extensive input properties for customization
- **Composable**: Complex UIs built from simple components
- **Maintainable**: Single source of truth for styling and behavior

### Separation of Concerns
- **Shared Components**: Generic UI elements (buttons, inputs, etc.)
- **Feature Components**: Business logic specific components
- **Layout Components**: Application structure (header, sidebar, footer)
- **Core Services**: Data management and business logic

---

## Design System Foundation

### Color System
The application uses CSS custom properties for consistent theming:

**Primary Brand Colors**:
- `--bg-color-blue-lighter: #29abe2` - Primary brand color
- `--bg-color-blue-darker: #2a3647` - Secondary brand color
- `--bg-color-white: #fff` - Background color
- `--bg-color-gray: #f6f7f8` - Light gray background
- `--bg-color-gray-darker: #d1d1d1` - Border and separator color

**Text Colors**:
- `--text-color-blue: #2a3647` - Primary text
- `--text-color-black: #000` - High contrast text
- `--color-link: #007cee` - Link color

### Typography System
The typography system uses responsive sizing with clamp() functions for optimal readability across devices:

**Headings**: H1-H4 with responsive scaling
**Body Text**: Standard text and small text variants
**Interactive Elements**: Input and button specific sizing
**Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Font Loading
Inter font family is loaded locally with optimized WOFF2 format for performance with font-display: swap.

---

## Shared Component Library

### Current Component Status

#### Button Component
**Location**: `src/app/shared/components/button/`
**Status**: Placeholder - Requires Implementation

**Key Features**:
- Multiple variants (primary, secondary, danger, ghost)
- Size options (small, medium, large)
- Icon support with positioning
- Loading and disabled states
- Full-width option
- Custom event handling

#### Input Field Component
**Location**: `src/app/shared/components/input-field/`
**Status**: Placeholder - Requires Implementation

**Key Features**:
- Multiple input types (text, email, password, tel, number)
- Label and placeholder support
- Icon integration
- Error message display
- Helper text support
- Validation state indicators
- Reactive Forms integration

#### Profile Picture Component
**Location**: `src/app/shared/components/profile-picture/`
**Status**: Placeholder - Requires Implementation

**Key Features**:
- Image source or initials display
- Size variants (small, medium, large)
- Color customization
- Border styling
- Clickable interaction
- Fallback handling

---

## Implementation Guidelines

### Component Creation Standards

#### File Structure
Standard component structure:
- `component-name.ts` - Component logic
- `component-name.html` - Template
- `component-name.scss` - Styles
- `component-name.spec.ts` - Unit tests

#### Component Architecture
- Use Angular standalone components
- Implement proper lifecycle hooks
- Follow reactive programming patterns
- Include comprehensive TypeScript typing
- Emit custom events for parent communication

#### Input Properties Guidelines
- Use TypeScript strict typing with union types
- Provide sensible defaults
- Include optional and required distinctions
- Document expected data types

### Styling Guidelines

#### BEM Methodology
Use Block-Element-Modifier naming convention:
- Block: `.component-name`
- Element: `.component-name__element`
- Modifier: `.component-name--modifier`

#### CSS Custom Properties Integration
- Always use CSS variables for themeable properties
- Leverage existing design system variables
- Maintain consistency with color and typography scales

#### Responsive Design Approach
- Mobile-first development strategy
- Use CSS clamp() for responsive typography
- Implement appropriate breakpoints
- Ensure touch-friendly sizing (44px minimum)

---

## Asset Management

### Icon System
Icons are organized by feature in the public directory with semantic naming:

**Available Icon Categories**:
- Join branding (logo variants)
- Sidebar navigation (board, contacts, summary icons)
- Authentication (login, mail, lock icons)
- Contact management (person, phone, edit icons)
- Task management (add task, priority, calendar icons)
- Board interface (search, add, priority symbols)
- General assets (arrows, close, help, search icons)

### Icon Usage Guidelines
- **Format**: SVG for scalability and performance
- **Naming**: Semantic names based on function
- **Sizing**: Standard sizes (16px, 24px, 32px, 48px)
- **Accessibility**: Include appropriate alt text

### Font Management
- **Primary Font**: Inter (locally hosted for performance)
- **Available Weights**: 400, 500, 600, 700
- **Format**: WOFF2 with font-display: swap
- **Fallback**: System fonts (sans-serif)

---

## Development Workflow

### Component Development Process

#### Planning Phase
- Define component requirements and API design
- Create TypeScript interface definitions
- Plan styling variants and responsive behavior
- Consider accessibility requirements

#### Implementation Phase
- Create component structure following standards
- Implement template with proper accessibility
- Add styling using BEM methodology and design system
- Write comprehensive unit tests
- Document usage examples

#### Integration Phase
- Test component in different application contexts
- Verify responsive behavior across devices
- Validate accessibility compliance
- Update documentation with real-world examples

### Code Quality Standards

#### TypeScript Requirements
- Use strict mode configuration
- Implement proper type definitions
- Avoid any types
- Use meaningful variable and function names

#### Linting and Formatting
Pre-commit requirements:
- Run `npm run prettier:write` for code formatting
- Execute linting checks
- Verify no TypeScript compilation errors

#### Testing Requirements
- Unit tests for all public methods and properties
- Component testing for user interactions
- Accessibility testing integration
- Cross-browser compatibility verification

### Version Control Guidelines
- Create feature branches for new components
- Use descriptive commit messages following convention
- Include documentation updates in pull requests
- Review code for consistency with existing patterns
- Test thoroughly before merging

---

## Maintenance and Updates

### Regular Review Schedule
- **Monthly**: Component usage pattern analysis
- **Quarterly**: Design system token updates
- **Per Release**: Documentation and example updates

### Breaking Changes Protocol
1. Deprecate old API with clear warnings
2. Provide comprehensive migration guide
3. Update all existing usage examples
4. Remove deprecated features in next major version

### Performance Monitoring
- Bundle size impact analysis
- Runtime performance testing
- Accessibility compliance checking
- Cross-browser compatibility validation

---

## Contributing Guidelines

### Adding New Components
1. Follow established file structure and naming
2. Implement consistent API patterns
3. Include comprehensive documentation
4. Add practical usage examples
5. Ensure accessibility compliance

### Modifying Existing Components
1. Consider backward compatibility impact
2. Update all affected documentation
3. Test across all known usage contexts
4. Communicate changes to team members

### Questions and Support
For component implementation questions:
- Reference this documentation
- Review existing component examples
- Consult in team design system meetings
- Request code review feedback

---

*Last updated: 2025-09-20*
*Document version: 2.0*