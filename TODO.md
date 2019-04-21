# TODO 

## Concept

- there a separated Containers and (presentational) components; 
- updates are send globally to all containers
- containers map data and send only important parts of DataView to components
- containers prepares callbacks (Actions) for presentational components

- presentational components are used only to display data (they don't contain data-level logic)
- react components should receive ummutable props from containers

- presentational components don't modify global state directly, they uses a callbacks (firing actions)

- presentational components may be imported from other libs

## Proof of concept
> redux-way to bind data (HOC containers)
> provide immutability of visualProperties and options
> 
> check destroy() method with eventListeners
>

## Actions & Storage
> how to 

## Tests
> Provide basic tests for methods of ReactVisual
> Provide the way to test containers