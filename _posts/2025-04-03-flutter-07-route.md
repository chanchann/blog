---
layout: post
title: "Flutter 08 : Network Requests and Data Processing"
author: "chanchan"
categories: journal
tags: [flutter]
image: mountains.jpg
toc: true
---

In Flutter applications, **network requests** refer to the process of retrieving data from or sending data to a server through HTTP requests (such as GET, POST, etc.). **Data processing** involves parsing, transforming, and utilizing the raw data (typically in JSON format) received from the network.

Flutter doesn't include a complete network request library by default, but it can be easily implemented using Dart's `http` package and other tools.

---

### 2. Preparation
#### 2.1 Adding Dependencies
Add the `http` package to your `pubspec.yaml` file:
```yaml
dependencies:
  http: ^1.2.1
```
Then run `flutter pub get` to fetch the dependencies.

#### 2.2 Network Permissions
- **Android**: Add the following to `android/app/src/main/AndroidManifest.xml`:
  ```xml
  <uses-permission android:name="android.permission.INTERNET" />
  ```
- **iOS**: Usually requires no additional configuration as network requests are allowed by default.

---

### 3. Basic Network Requests
Flutter uses the `http` package for network requests. Here are common operations:

#### 3.1 GET Request
The most common way to fetch data is through GET requests. Example:

```dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _data = 'Loading...';

  Future<void> fetchData() async {
    final response = await http.get(Uri.parse('https://jsonplaceholder.typicode.com/posts/1'));
    if (response.statusCode == 200) {
      // Successfully fetched data
      setState(() {
        _data = response.body; // Raw JSON string
      });
    } else {
      // Request failed
      setState(() {
        _data = 'Failed to load data';
      });
    }
  }

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Network Request Example')),
      body: Center(child: Text(_data)),
    );
  }
}
```

**Explanation**:
- `http.get()` sends a GET request and returns a `Response` object.
- `response.statusCode` checks if the request was successful (200 indicates success).
- `response.body` contains the raw data (in string format).

#### 3.2 POST Request
To send data to a server, use POST requests. Example:

```dart
Future<void> postData() async {
  final response = await http.post(
    Uri.parse('https://jsonplaceholder.typicode.com/posts'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'title': 'Flutter Post',
      'body': 'This is a test post',
      'userId': 1,
    }),
  );

  if (response.statusCode == 201) {
    setState(() {
      _data = 'Post created: ${response.body}';
    });
  } else {
    setState(() {
      _data = 'Failed to create post';
    });
  }
}
```

**Explanation**:
- `http.post()` requires URL, headers, and body.
- `jsonEncode()` converts Dart objects to JSON strings.
- Status code 201 indicates successful resource creation.

---

### 4. Data Processing (JSON Parsing)
Network requests typically return data in JSON format, which needs to be parsed into Dart objects.

#### 4.1 Manual JSON Parsing
Using `dart:convert`'s `jsonDecode()`:

```dart
Future<void> fetchData() async {
  final response = await http.get(Uri.parse('https://jsonplaceholder.typicode.com/posts/1'));
  if (response.statusCode == 200) {
    final data = jsonDecode(response.body); // Parse JSON
    setState(() {
      _data = 'Title: ${data['title']}\nBody: ${data['body']}';
    });
  } else {
    setState(() {
      _data = 'Failed to load data';
    });
  }
}
```

**Example JSON Response**:
```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita..."
}
```

#### 4.2 Using Model Classes (Recommended)
For better data management, create model classes with `fromJson` methods:

```dart
// Model class
class Post {
  final int userId;
  final int id;
  final String title;
  final String body;

  Post({required this.userId, required this.id, required this.title, required this.body});

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      userId: json['userId'],
      id: json['id'],
      title: json['title'],
      body: json['body'],
    );
  }
}

// Fetch and parse data
Future<void> fetchData() async {
  final response = await http.get(Uri.parse('https://jsonplaceholder.typicode.com/posts/1'));
  if (response.statusCode == 200) {
    final post = Post.fromJson(jsonDecode(response.body));
    setState(() {
      _data = 'Title: ${post.title}\nBody: ${post.body}';
    });
  } else {
    setState(() {
      _data = 'Failed to load data';
    });
  }
}
```

**Advantages**:
- Type safety
- Easy data reuse throughout the app

#### 4.3 Parsing Lists
For JSON arrays (e.g., multiple Posts):

```dart
Future<void> fetchPosts() async {
  final response = await http.get(Uri.parse('https://jsonplaceholder.typicode.com/posts'));
  if (response.statusCode == 200) {
    final List<dynamic> jsonList = jsonDecode(response.body);
    final posts = jsonList.map((json) => Post.fromJson(json)).toList();
    setState(() {
      _data = posts.map((p) => p.title).join('\n');
    });
  } else {
    setState(() {
      _data = 'Failed to load posts';
    });
  }
}
```

---

### 5. Asynchronous Processing and Error Management
#### 5.1 Using Future and async/await
Network requests are asynchronous operations that must be handled using `Future` and `async/await`.

#### 5.2 Error Handling
Use `try-catch` to catch exceptions:

```dart
Future<void> fetchData() async {
  try {
    final response = await http.get(Uri.parse('https://jsonplaceholder.typicode.com/posts/1'));
    if (response.statusCode == 200) {
      final post = Post.fromJson(jsonDecode(response.body));
      setState(() {
        _data = 'Title: ${post.title}';
      });
    } else {
      throw Exception('Failed with status: ${response.statusCode}');
    }
  } catch (e) {
    setState(() {
      _data = 'Error: $e';
    });
  }
}
```

#### 5.3 Loading States
Use `FutureBuilder` to display loading states:

```dart
Future<Post> fetchPost() async {
  final response = await http.get(Uri.parse('https://jsonplaceholder.typicode.com/posts/1'));
  if (response.statusCode == 200) {
    return Post.fromJson(jsonDecode(response.body));
  } else {
    throw Exception('Failed to load post');
  }
}

@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: Text('FutureBuilder Example')),
    body: FutureBuilder<Post>(
      future: fetchPost(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else if (snapshot.hasData) {
          return Center(child: Text('Title: ${snapshot.data!.title}'));
        }
        return Center(child: Text('No data'));
      },
    ),
  );
}
```

---

### 6. Advanced Tools and Libraries
- **Dio**: A more powerful HTTP client supporting interceptors, file uploads, etc.
  - Add dependency: `dio: ^5.4.0`
  - Example:
    ```dart
    import 'package:dio/dio.dart';

    Future<void> fetchWithDio() async {
      final dio = Dio();
      final response = await dio.get('https://jsonplaceholder.typicode.com/posts/1');
      setState(() {
        _data = response.data['title'];
      });
    }
    ```
- **Chopper** or **Retrofit**: For generating type-safe API calls.
- **GraphQL**: Use `graphql_flutter` for GraphQL requests.

---

### 7. Important Considerations
- **Timeout Handling**: Set timeout for `http.Client` to avoid infinite waiting.
- **Security**: Use HTTPS and add authentication (e.g., Token) when necessary.
- **State Management**: Combine with Provider, BLoC, etc., for managing network data.

---

### 8. Summary
- **Network Requests**: Use `http` package for GET, POST operations.
- **Data Processing**: Parse JSON using `jsonDecode` and model classes.
- **Asynchronous UI**: Optimize user experience with `FutureBuilder` or state management.
- **Advanced Options**: Libraries like Dio provide additional features.
