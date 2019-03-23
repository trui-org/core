# core
The core of the trui framework

## Quick Start

<details open>
<summary>npm</summary>
    
```bash
npm install @trui/core
```
</details>

<details open>
<summary>yarn</summary>
    
```bash
yarn add @trui/core
```
</details>

## What is this?

This project serves to hold the core implementation for the truie framework. It will include interfaces for network adapters, a module for the "playback" feature, etc.

## Why?

Not everyone has the knack for UI work, nor the time to learn it, nor the patience and willingness to pick it up. I completely understand that to some people
User Interface design can be boring and tedious. This framework seeks to fill in that gap and provides prebuilt components for creating real-time dashboards.


## How is it designed?

Almost everything will be it's own little module that can configured. There's going to be 3 parts to the design.

1. Network Adapters

There will be a generic interface for `PubSub` clients and an `NetworkAdapater` class will need to be written that
implements the `PubSub` client. The `NetworkAdapter` acts as the glue between the generic client and the actual client.
Here's an example:

When a `subscribe()` method is called through the `NetworkAdapter` class, then under the hood it will pass the topic the client
is trying to subscribe to the underlying _PubSub Server_.

2. End-User Components

The only thing the end-user will ever interact with will be the end-user component libraries written with React, Vue, or Angular, etc.
They may touch the `Playback` server but nonetheless, most of the end-user interaction will be with the component libraries.
This means that the component libraries can take advantage of the defined interfaces and classes to connect the components to the
real-time network.

3. TypeScript

All of the code will be written in TypeScript. This is to ensure maintability and sanity.

## Other considerations

I am planning to only support modern browsers. No Internet Explorer support. This is to avoid having compatibility headaches and/or adding
polyfills if I don't have to. Besides, the team has full control of what browser to use on the base station so it should be easy
to choose a modern browser like Google Chrome or Firefox.