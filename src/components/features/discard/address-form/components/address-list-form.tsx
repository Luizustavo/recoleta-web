import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";

export default function AddressListForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Endereços para Coleta</CardTitle>
        <CardDescription>
          Visualize seus endereços cadastrados ou adicione um novo endereço para
          coleta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="registered">
          <TabsList>
            <TabsTrigger value="registered">Endereços Cadastrados</TabsTrigger>
            <TabsTrigger value="new">Novo Endereço</TabsTrigger>
          </TabsList>
          <TabsContent value="registered">
            <div>
              {" "}
              {/* aqui será o form */}
              <Card key={""}>
                <CardContent>
                  <p>
                    <strong>Rua:</strong> Rua
                  </p>
                  <p>
                    <strong>Bairro:</strong> Bairro
                  </p>
                  <p>
                    <strong>Cidade:</strong> CIdade
                  </p>
                  <p>
                    <strong>CEP:</strong> Cep
                  </p>
                </CardContent>
              </Card>
              <div>
                <Button type="button">Voltar</Button>
                <Button type="submit">Avançar</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
