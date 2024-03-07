#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <curl/curl.h>

struct Response {
	char *string;
	size_t size;
};

size_t write_chunk(void* data, size_t size, size_t nmemb, void* userdata){
	size_t real_size = size *nmemb;
	struct Response* response = (struct Response*)userdata;
	char *ptr = realloc(response->string, response->size + real_size + 1);
	if(ptr == NULL){
		return CURL_WRITEFUNC_ERROR;
	}
	response->string = ptr;
	memcpy(&(response->string[response->size]), data, real_size);
	response->size += real_size;
	response->string[response->size] = '\0';
	return real_size;
}

char* makeRequest(char* url){
	struct Response response;
	response.string = malloc(1);
	response.size = 0;
	CURL *curl = curl_easy_init();
	curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
	curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 0L);
	curl_easy_setopt(curl, CURLOPT_CA_CACHE_TIMEOUT, 604800L);
	curl_easy_setopt(curl, CURLOPT_URL, url);
	curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_chunk);
	curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void*)&response);
	CURLcode responseCode = curl_easy_perform(curl);
	curl_easy_cleanup(curl);
	return response.string;
}



int main(int argc, char** argv) {
	char* indexHtml = malloc(1);
	indexHtml[0] = '\0';
	for(size_t i = 0; i < 1; i++){
		char* data = makeRequest("https://google.com");
		char* temp = realloc(indexHtml, strlen(indexHtml) + strlen(data) + 1);
		indexHtml = temp;
		strcat(indexHtml, data);
		free(data);

	}
	printf("%s", indexHtml);
	free(indexHtml);
	return 0;
}
